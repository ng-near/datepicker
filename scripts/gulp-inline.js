var fs = require('fs');
var path = require('path');

var through = require('through2');
var replacestream = require('replacestream');

function resolveFile(sourcePath, urlString) {
  return path.join(path.dirname(filePath), styleUrl);
}

/**
 * Inline the templates for a source file. Simply search for instances of `templateUrl: ...` and
 * replace with `template: ...` (with the content of the file included).
 * @param content {string} The source file's content.
 * @param urlResolver {Function} A resolver that takes a URL and return a path.
 * @return {string} The content with all templates inlined.
 */
var template = {
  search: /templateUrl:\s*'([^']+?\.html)'/g,
  replace: function(filePath){
    function(m, templateUrl) {
      const templateFile = resolveFile(filePath, templateUrl);
      const templateContent = fs.readFileSync(templateFile, 'utf-8');
      const shortenedTemplate = templateContent
        .replace(/([\n\r]\s*)+/gm, '')
        .replace(/"/g, '\\"');
      return `template: "${shortenedTemplate}"`;
    });
  }
}


/**
 * Inline the styles for a source file. Simply search for instances of `styleUrls: [...]` and
 * replace with `styles: [...]` (with the content of the file included).
 * @param urlResolver {Function} A resolver that takes a URL and return a path.
 * @param content {string} The source file's content.
 * @return {string} The content with all styles inlined.
 */
var style = {
  search: /styleUrls:\s*(\[[\s\S]*?\])/gm,
  replace: function(filePath){
    return function(m, styleUrls) {
      const urls = eval(styleUrls);
      return 'styles: ['
        + urls.map(styleUrl => {
            const styleFile = resolveFile(filePath, styleUrl);
            const styleContent = fs.readFileSync(styleFile, 'utf-8');
            const shortenedStyle = styleContent
              .replace(/([\n\r]\s*)+/gm, ' ')
              .replace(/"/g, '\\"');
            return `"${shortenedStyle}"`;
          })
          .join(',\n')
        + ']';
    });
  }
}

function inline() {
  return through.obj(function(file, enc, cb) {

    if (file.isStream()) {
      file.contents = file.contents
        .pipe( replacestream(template.search, template.replace(file.path)))
        .pipe( replacestream(style.search, style.replace(file.path)))
    }
    if (file.isBuffer()) {
      file.contents = new Buffer(String(file.contents)
        .replace(template.search, template.replace(file.path))
        .replace(style.search, style.replace(file.path))
      )
    }

    return cb(null, file);
  });
}

module.exports = inline;
