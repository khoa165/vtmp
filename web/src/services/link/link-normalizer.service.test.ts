import { expect } from 'chai';
import { LinkNormalizerService } from '@/services/link/link-normalizer.service';

describe.only('LinkNormalizerService', () => {
  describe('removeFormatting', () => {
    it('should remove quotes', () => {
      const url = LinkNormalizerService.removeFormatting('"google.com"');
      expect(url).to.equal('google.com');
    });

    it('should remove brackets', () => {
      const url = LinkNormalizerService.removeFormatting('{google.com}');
      expect(url).to.equal('google.com');
    });

    it('should remove parentheses', () => {
      const url = LinkNormalizerService.removeFormatting('<google.com>');
      expect(url).to.equal('google.com');
    });
    it('should remove mixed formatting characters', () => {
      const url = LinkNormalizerService.removeFormatting('<"{<google.com>}">');
      expect(url).to.equal('google.com');
    });
  });

  describe('lowercaseDomainAndPath', () => {
    it('should lowercase the domain and path', () => {
      const url = LinkNormalizerService.lowercaseDomain('HTTP://EXAMPLE.COM/PAGE');
      expect(url).to.equal('http://example.com/PAGE');
    });

    it('should lowercase the domain but preserve the sensitive', () => {
      const url = LinkNormalizerService.lowercaseDomain('HTTP://GITHUB.COM/User/Repository/Tree/MAIN');
      expect(url).to.equal('http://github.com/User/Repository/Tree/MAIN');
    });
  });
  
  describe('removeWWW', () => {
    it('should remove www from url if it exists', () => {
      const url = LinkNormalizerService.removeWWW('www.google.com');
      expect(url).to.equal('https://google.com');
    });

    it('should remove www even if it is in the middle of the url', () => {
      const url = LinkNormalizerService.removeWWW('https://www.facebook.com');
      expect(url).to.equal('https://facebook.com');
    });
    
    it('should remove WWW (uppercase)', () => {
      const url = LinkNormalizerService.removeWWW('https://WWW.facebook.com/');
      expect(url).to.equal('https://facebook.com');
    })

    it('should not remove www', () => {
      const url = LinkNormalizerService.removeWWW('https://wwwabc.com');
      expect(url).to.equal('https://wwwabc.com');
    })
  });

  describe('removeTrailingSlash', () => {
    it('should remove single forward slash at the end of url if it exists', () => {
      const url = LinkNormalizerService.removeTrailingSlash('https://google.com/');
      expect(url).to.equal('https://google.com');
    });

    it('should remove multiples forward slash at the end of url if it exists', () => {
      const url = LinkNormalizerService.removeTrailingSlash('https://google.com////');
      expect(url).to.equal('https://google.com');
    });

    it('should remove single backward slash at the end of url if it exists', () => {
      const url = LinkNormalizerService.removeTrailingSlash('https://google.com\\');
      expect(url).to.equal('https://google.com');
    });

    it('should remove multiple backward slash at the end of url if it exists', () => {
      const url = LinkNormalizerService.removeTrailingSlash('https://google.com\\\\\\\\');
      expect(url).to.equal('https://google.com');
    });

    it('should remove single forward and backward slash at the end of url if it exists', () => {
      const url = LinkNormalizerService.removeTrailingSlash('https://google.com/\\');
      expect(url).to.equal('https://google.com');
    });

    it('should remove single backward and forward slash at the end of url if it exists', () => {
      const url = LinkNormalizerService.removeTrailingSlash('https://google.com\\/');
      expect(url).to.equal('https://google.com');
    });

    it('should leave the url unchanged if there is no trailing slash', () => {
      const url = LinkNormalizerService.removeTrailingSlash('https://google.com');
      expect(url).to.equal('https://google.com');
    });
  });

  describe.only('removeAnalyticQueryAndFragment', () => {
    it('should remove a single utm_source parameter', () => {
      const result = LinkNormalizerService.removeAnalyticQueryAndFragment('https://example.com/page?utm_source=google');
      expect(result).to.equal('https://example.com/page');
    });
  
    it('should remove multiple analytics parameters and preserve other query params', () => {
      const result = LinkNormalizerService.removeAnalyticQueryAndFragment('https://example.com/page?foo=bar&utm_medium=email&utm_campaign=spring&baz=qux');
      expect(result).to.equal('https://example.com/page?foo=bar&baz=qux');
    });
  
    it('should remove analytics parameters regardless of position in the query string', () => {
      const result = LinkNormalizerService.removeAnalyticQueryAndFragment('https://example.com/page?utm_term=test&foo=bar');
      expect(result).to.equal('https://example.com/page?foo=bar');
    });
  
    it('should remove click identifiers like fbclid, gclid, msclkid, etc.', () => {
      const result = LinkNormalizerService.removeAnalyticQueryAndFragment('https://example.com/?fbclid=123&utm_content=xyz&gclid=456&source=ref');
      expect(result).to.equal('https://example.com');
    });
  
    it('should leave the URL unchanged if there are no analytics parameters', () => {
      const result = LinkNormalizerService.removeAnalyticQueryAndFragment('https://example.com/page?foo=bar&baz=qux');
      expect(result).to.equal('https://example.com/page?foo=bar&baz=qux');
    });
  
    it('should remove the fragment identifier', () => {
      const result = LinkNormalizerService.removeAnalyticQueryAndFragment('https://example.com/page?utm_source=google#section1');
      expect(result).to.equal('https://example.com/page');
    });
  
    it('should handle a URL with no query string and just a fragment', () => {
      const input = 'https://example.com/page#top';
      const result = LinkNormalizerService.removeAnalyticQueryAndFragment(input);
      expect(result).to.equal('https://example.com/page');
    });
  });
  describe('removePorts', () => {
    it('should remove the default HTTP port 80', () => {
      const url = LinkNormalizerService.removePorts('http://example.com:80/path');
      expect(url).to.equal('http://example.com/path');
    });
  
    it('should remove the default HTTPS port 443', () => {
      const url = LinkNormalizerService.removePorts('https://secure.example.com:443/login');
      expect(url).to.equal('https://secure.example.com/login');
    });
  
    it('should remove a non-default port', () => {
      const url = LinkNormalizerService.removePorts('http://localhost:8080/api');
      expect(url).to.equal('http://localhost/api');
    });
  
    it('should leave URLs without a port unchanged', () => {
      const url = LinkNormalizerService.removePorts('https://example.com/home');
      expect(url).to.equal('https://example.com/home');
    });
  
    it('should handle URLs with credentials and a port', () => {
      const url = LinkNormalizerService.removePorts('ftp://user:pass@ftp.example.com:21/files');
      expect(url).to.equal('ftp://user:pass@ftp.example.com/files');
    });
  
    it('should handle IPv6 host literals with a port', () => {
      const url = LinkNormalizerService.removePorts('http://[2001:db8::1]:8080/resource');
      expect(url).to.equal('http://[2001:db8::1]/resource');
    });
  
    it('should return the original string if the input is not a valid URL', () => {
      const input = 'not a url:1234/path';
      const result = LinkNormalizerService.removePorts(input);
      expect(result).to.equal(input);
    });
  });
});
