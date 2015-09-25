(function (ng) {
    ng.module('ui.svgRender', [])
        .run(["$templateCache", function ($templateCache) {
            $templateCache.put("noFileFound.html", "<span>No file found!</span>");
        }])
        .factory('svgRenderFileService', [
            function () {
                var _baseDirectory = "",
                    _templates = {};

                function setBaseDirectory(baseDir) {
                    _baseDirectory = baseDir;
                }

                function getBaseDirectory() {
                    return _baseDirectory;
                }

                function setTemplates(newTemplates) {
                    _templates = newTemplates;
                }

                function getTemplates() {
                    return _templates;
                }

                function getTemplate(template) {
                    return _templates[template];
                }

                function addTemplate(name, url) {
                    _templates[name] = _baseDirectory + url;
                }

                return {
                    setBaseDirectory: setBaseDirectory,
                    getBaseDirectory: getBaseDirectory,
                    setTemplates: setTemplates,
                    getTemplates: getTemplates,
                    getTemplate: getTemplate,
                    addTemplate: addTemplate
                };
            }
        ])
        .directive('svgRender', ['$compile', function ($compile) {
            var template = '<svg-render-inner svg="{{svg}}" h="{{h}}" w="{{w}}"></svg-render-inner>';
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    svg: '@',
                    height: '@?h',
                    width: '@?w'
                },
                link: function (scope, elem, attrs) {
                    var newTemp = template.replace('{{svg}}', scope.svg);
                    newTemp = scope.height ? newTemp.replace('{{h}}', scope.height) : newTemp.replace('h={{h}}', '');
                    newTemp = scope.width ? newTemp.replace('{{w}}', scope.width) : newTemp.replace('w={{w}}', '');
                    elem.html(newTemp);
                    $compile(elem.contents())(scope);
                }
            };
        }])
        .directive('svgRenderInner', ['$log', 'svgRenderFileService', function ($log, svgRenderFileService) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    svg: '@',
                    height: '@?h',
                    width: '@?w'
                },
                link: function (scope, element, attrs) {
                    var cssAttributes = {
                        height: scope.height ? scope.height + "px" : undefined,
                        width: scope.width ? scope.width + "px" : undefined
                    };
                    element.css(cssAttributes);
                },
                templateUrl: function (element, attrs) {
                    var result = svgRenderFileService.getTemplate(attrs.svg);

                    if (!result) {
                        $log.error('Unfound Symbol: ' + attrs.svg);
                        return 'noFileFound.html';
                    }
                    return result;
                }
            };
        }]);
})(angular);