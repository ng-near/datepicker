const path = require('path');
const del = require('del');

const gulp = require('gulp');
const file = require('gulp-file');
const seq = require('gulp-sequence');

const inlineResources = require('./scripts/inline-resources');

const ngc = require('@angular/compiler-cli/src/main').main;
const Vinyl = require('vinyl');
const tsconfig = require('./tsconfig.json');
const merge = require('deepmerge');

const ts = require("typescript");
const tslint = require('tslint');
const gulpTslint = require('gulp-tslint');

const rollup = require('rollup').rollup;
const rollupSourcemaps = require('rollup-plugin-sourcemaps');

const packageJson = require('./package.json');
const projectName = packageJson.name;

function root(pathStr) {
    return path.join(__dirname, pathStr);
}

const buildDir = root('build');
const distDir = root('dist');

function getTsConfig(overrideConfig = {}) {
    const options = merge(tsconfig, overrideConfig);

    return new Vinyl({
        path: './tsconfig',
        contents: new Buffer( JSON.stringify(options) )
    });
}

function build(target) {
    const buildPath = path.join(buildDir, target);

    return ngc({
        project: getTsConfig({
            compilerOptions: {
                target: target,
                outDir: buildPath
            },
            files: [ 'src/index.ts' ],
            angularCompilerOptions: {
                flatModuleOutFile: projectName + '.js',
                flatModuleId: projectName
            }
        })
    })
    .then( () =>
        rollup({
            entry: path.join(buildPath, projectName + '.js'),

            moduleName: projectName,
            sourceMap: true,
            plugins: [
                rollupSourcemaps()
            ],

            external: id => {
                return id.startsWith('@angular') || id.startsWith('rxjs')
            }
        })
        .then( bundle => bundle.write({
            format: 'es',
            dest: path.join(distDir, projectName + '.' + target + '.js'),
        }))
    );
}

gulp.task('build:es5', () => {
    return build('es5');
});

gulp.task('build:es2015', () => {
    return build('es2015');
});

gulp.task('build:copy', () => {
    const buildPath = path.join(buildDir, 'es2015')
    const distPackage = Object.assign({}, packageJson, {
        module: projectName + '.es5.js',
        es2015: projectName + '.es2015.js',
        typings: projectName + '.d.ts'
    });

    return gulp.src([
            'LICENSE',
            'README.md',
            buildPath + '/**/*.{d.ts,metadata.json}',
        ])
        .pipe( file('package.json',
            JSON.stringify(distPackage, (key, value) =>
                key === 'scripts' ||
                key === 'devDependencies' ||
                key === 'files' ?
                    undefined
                :
                    value
            , 2)
        ))
        .pipe( gulp.dest(distDir) );
});

gulp.task('clean', () => {
    return del([
        buildDir,
        distDir
    ]);
});

gulp.task('tslint', () => {
  const tslintProgram = tslint.Linter.createProgram("./tsconfig.json", ".");
  ts.getPreEmitDiagnostics(tslintProgram);

  return gulp.src(['src/**/*.ts', '!**/*.spec.ts'])
    .pipe(gulpTslint({
      program: tslintProgram
    }))
    .pipe(gulpTslint.report())
});

gulp.task('build', cb => {
    seq(
        'clean',
        'tslint',
        ['build:es5', 'build:es2015'],
        'build:copy',
        cb
    )
});
