// import { expect } from 'chai';
// import { LinkNormalizerService } from '@/services/link-normalizer.service';
// import { useSandbox } from '@/testutils/sandbox.testutil';
// import assert from 'assert';

// describe('LinkNormalizerService', () => {
//   describe('removeFormatting', () => {
//     it('should remove quotes', () => {
//       const url = LinkNormalizerService.removeFormatting('"google.com"');
//       expect(url).to.equal('google.com');
//     });

//     it('should remove brackets', () => {
//       const url = LinkNormalizerService.removeFormatting('{google.com}');
//       expect(url).to.equal('google.com');
//     });

//     it('should remove parentheses', () => {
//       const url = LinkNormalizerService.removeFormatting('<google.com>');
//       expect(url).to.equal('google.com');
//     });

//     it('should remove mixed formatting characters', () => {
//       const url = LinkNormalizerService.removeFormatting('<"{<google.com>}">');
//       expect(url).to.equal('google.com');
//     });

//     it('should remove all types of brackets', () => {
//       const url = LinkNormalizerService.removeFormatting(
//         '{(((((((}}google.com}[(<)}'
//       );
//       expect(url).to.equal('google.com');
//     });

//     it('should remove all types of quotations', () => {
//       const url = LinkNormalizerService.removeFormatting(
//         '"""""""```````"google.com"'
//       );
//       expect(url).to.equal('google.com');
//     });
//   });

//   describe('standardizeUrl', () => {
//     describe('lower case domain', () => {
//       it('should lowercase the domain and path', () => {
//         const url = LinkNormalizerService.standardizeUrl(
//           'HTTPS://EXAMPLE.COM/PAGE'
//         );
//         expect(url).to.equal('https://example.com/PAGE');
//       });

//       it('should lowercase the domain but preserve the sensitive', () => {
//         const url = LinkNormalizerService.standardizeUrl(
//           'HTTPS://GITHUB.COM/User/Repository/Tree/MAIN'
//         );
//         expect(url).to.equal('https://github.com/User/Repository/Tree/MAIN');
//       });
//     });

//     describe('remove www', () => {
//       it('should remove www from url if it exists', () => {
//         const url = LinkNormalizerService.standardizeUrl('www.google.com');
//         expect(url).to.equal('https://google.com');
//       });

//       it('should remove www even if it is in the middle of the url', () => {
//         const url = LinkNormalizerService.standardizeUrl(
//           'https://www.facebook.com'
//         );
//         expect(url).to.equal('https://facebook.com');
//       });

//       it('should remove WWW (uppercase)', () => {
//         const url = LinkNormalizerService.standardizeUrl(
//           'https://WWW.facebook.com/'
//         );
//         expect(url).to.equal('https://facebook.com');
//       });

//       it('should not remove www when it is part of domain', () => {
//         const url = LinkNormalizerService.standardizeUrl('https://wwwabc.com');
//         expect(url).to.equal('https://wwwabc.com');
//       });
//     });

//     describe('remove trailing slash', () => {
//       it('should remove multiples forward slash at the end of url if it exists', () => {
//         const url = LinkNormalizerService.standardizeUrl(
//           'https://google.com////'
//         );
//         expect(url).to.equal('https://google.com');
//       });

//       it('should remove single backward slash at the end of url if it exists', () => {
//         const url = LinkNormalizerService.standardizeUrl(
//           'https://google.com\\'
//         );
//         expect(url).to.equal('https://google.com');
//       });

//       it('should remove single backward and forward slash at the end of url if it exists', () => {
//         const url = LinkNormalizerService.standardizeUrl(
//           'https://google.com\\/\\//\\'
//         );
//         expect(url).to.equal('https://google.com');
//       });

//       it('should leave the url unchanged if there is no trailing slash', () => {
//         const url = LinkNormalizerService.standardizeUrl('https://google.com');
//         expect(url).to.equal('https://google.com');
//       });
//     });

//     describe('remove analytics', () => {
//       it('should remove a single utm_source parameter', () => {
//         const result = LinkNormalizerService.standardizeUrl(
//           'https://example.com/page?utm_source=google'
//         );
//         expect(result).to.equal('https://example.com/page');
//       });

//       it('should remove multiple analytics parameters and preserve other query params', () => {
//         const result = LinkNormalizerService.standardizeUrl(
//           'https://example.com/page?foo=bar&utm_medium=email&utm_campaign=spring&baz=qux'
//         );
//         expect(result).to.equal('https://example.com/page?foo=bar&baz=qux');
//       });

//       it('should remove analytics parameters regardless of position in the query string', () => {
//         const result = LinkNormalizerService.standardizeUrl(
//           'https://example.com/page?utm_term=test&foo=bar'
//         );
//         expect(result).to.equal('https://example.com/page?foo=bar');
//       });

//       it('should remove click identifiers like fbclid, gclid, msclkid, etc.', () => {
//         const result = LinkNormalizerService.standardizeUrl(
//           'https://example.com/?fbclid=123&utm_content=xyz&gclid=456&source=ref'
//         );
//         expect(result).to.equal('https://example.com');
//       });

//       it('should leave the URL unchanged if there are no analytics parameters', () => {
//         const result = LinkNormalizerService.standardizeUrl(
//           'https://example.com/page?foo=bar&baz=qux'
//         );
//         expect(result).to.equal('https://example.com/page?foo=bar&baz=qux');
//       });
//     });

//     describe('remove fragments', () => {
//       it('should remove the fragment identifier', () => {
//         const result = LinkNormalizerService.standardizeUrl(
//           'https://example.com/page?utm_source=google#section1'
//         );
//         expect(result).to.equal('https://example.com/page');
//       });

//       it('should handle a URL with no query string and just a fragment', () => {
//         const input = 'https://example.com/page#top';
//         const result = LinkNormalizerService.standardizeUrl(input);
//         expect(result).to.equal('https://example.com/page');
//       });
//     });

//     describe('remove ports', () => {
//       it('should remove the default HTTP port 80', () => {
//         const url = LinkNormalizerService.standardizeUrl(
//           'https://example.com:80/path'
//         );
//         expect(url).to.equal('https://example.com/path');
//       });

//       it('should remove the default HTTPS port 443', () => {
//         const url = LinkNormalizerService.standardizeUrl(
//           'https://secure.example.com:443/login'
//         );
//         expect(url).to.equal('https://secure.example.com/login');
//       });

//       it('should remove a non-default port', () => {
//         const url = LinkNormalizerService.standardizeUrl(
//           'https://localhost:8080/api'
//         );
//         expect(url).to.equal('https://localhost/api');
//       });

//       it('should leave URLs without a port unchanged', () => {
//         const url = LinkNormalizerService.standardizeUrl(
//           'https://example.com/home'
//         );
//         expect(url).to.equal('https://example.com/home');
//       });

//       it('should handle IPv6 host literals with a port', () => {
//         const url = LinkNormalizerService.standardizeUrl(
//           'https://[2001:db8::1]:8080/resource'
//         );
//         expect(url).to.equal('https://[2001:db8::1]/resource');
//       });
//     });

//     describe('remove multiple violations', () => {
//       it('should handle mixed wrappers, port, analytics params, and fragment', () => {
//         expect(
//           LinkNormalizerService.standardizeUrl(
//             '"{<HTTP://EXAMPLE.COM:8080/path/to/page?utm_source=google&utm_medium=email&keep=1#top>}"'
//           )
//         ).to.equal('https://example.com/path/to/page?keep=1');
//       });

//       it('should preserve credentials, remove default HTTPS port, strip fbclid and force HTTPS', () => {
//         expect(
//           LinkNormalizerService.standardizeUrl(
//             '\\("http://User:Pass@Sub.Example.com:443/secure?sessionid=abc&fbclid=XYZ"\\)'
//           )
//         ).to.equal('https://sub.example.com/secure?sessionid=abc');
//       });

//       it('should normalize IPv6 host with port and strip utm_campaign and fragment', () => {
//         expect(
//           LinkNormalizerService.standardizeUrl(
//             '`<http://[2001:db8::1]:9090/path?utm_campaign=test&x=2#frag>`'
//           )
//         ).to.equal('https://[2001:db8::1]/path?x=2');
//       });

//       it('should remove mixed curly/angle/backtick wrappers, strip _ga/_gl and trailing slash', () => {
//         expect(
//           LinkNormalizerService.standardizeUrl(
//             '({[`<http://MixedCASE.com:443/Path/?_ga=GA1.2.345&_gl=GL1.2.678&keep=this`]})'
//           )
//         ).to.equal('https://mixedcase.com/Path?keep=this');
//       });

//       it('should preserve query order for non-analytics params and strip utm_source/fbclid', () => {
//         expect(
//           LinkNormalizerService.standardizeUrl(
//             '"http://example.com?b=2&utm_source=src&a=1&fbclid=123&z=3"'
//           )
//         ).to.equal('https://example.com/?b=2&a=1&z=3');
//       });

//       it('should remove default HTTP port, strip ref and fragment, and drop trailing slash', () => {
//         expect(
//           LinkNormalizerService.standardizeUrl(
//             'http://example.com:80/path/to/?ref=referrer#anchor'
//           )
//         ).to.equal('https://example.com/path/to');
//       });

//       it('should handle wrappers plus whitespace/newlines, remove utm_content, and strip default port', () => {
//         expect(
//           LinkNormalizerService.standardizeUrl(
//             '"\n\thttp://Example.com:443/path?utm_content=content&keep=1\t\n"'
//           )
//         ).to.equal('https://example.com/path?keep=1');
//       });

//       it('should strip complex mixed wrappers, remove dclid, drop fragment, and force HTTPS', () => {
//         expect(
//           LinkNormalizerService.standardizeUrl(
//             '\\\\( "{http://EXAMPLE.COM/path?dclid=123&c=4#sect}\\\\)"'
//           )
//         ).to.equal('https://example.com/path?c=4');
//       });
//     });
//   });

//   describe('normalizeLink', () => {
//     const sandbox = useSandbox();
//     beforeEach(() => {
//       sandbox.restore();
//     });
//     it('should call standardizeUrl', () => {
//       const standardizeUrlStub = sandbox
//         .stub(LinkNormalizerService, 'standardizeUrl')
//         .returns('https://example.com');
//       LinkNormalizerService.normalizeLink(
//         'https://example.com/page?foo=bar&baz=qux'
//       );
//       assert(
//         standardizeUrlStub.calledWith(
//           'https://example.com/page?foo=bar&baz=qux'
//         )
//       );
//     });

//     it('should log if query params still exist', () => {
//       const logFunction = sandbox.spy(console, 'log');
//       LinkNormalizerService.normalizeLink(
//         'https://example.com/page?foo=bar&baz=qux'
//       );
//       assert(logFunction.calledOnce);
//     });

//     it('should not log if query params still exist', () => {
//       const logFunction = sandbox.spy(console, 'log');
//       LinkNormalizerService.normalizeLink(
//         'https://example.com/page?utm_source=bar&utm_medium=qux'
//       );
//       assert(logFunction.notCalled);
//     });
//   });
// });
