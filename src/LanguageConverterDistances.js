/**
 * Adds a CSS class indicating the "Levenshtein distance" between the
 * "original expression" and the "converted expression" of each rule of the
 * dictionaries
 *
 * @author: Helder (https://github.com/he7d3r)
 * @license: CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0/>
 */
( function ( mw, $ ) {
	'use strict';

	// Adapted from [[b:en:Algorithm Implementation/Strings/Levenshtein_distance#JavaScript]]
	function levenshtein(str1, str2) {
		var i, j, d,
			l1 = str1.length,
			l2 = str2.length;
		if (Math.min(l1, l2) === 0) {
			return Math.max(l1, l2);
		}
		i = 0;
		j = 0;
		d = [];
		for (i = 0; i <= l1; i += 1) {
			d[i] = [];
			d[i][0] = i;
		}
		for (j = 0; j <= l2; j += 1) {
			d[0][j] = j;
		}
		for (i = 1; i <= l1; i += 1) {
			for (j = 1; j <= l2; j += 1) {
				d[i][j] = Math.min(
				d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (str1.charAt(i - 1) === str2.charAt(j - 1) ? 0 : 1));
			}
		}
		return d[l1][l2];
	}

	function addEditDistance(e) {
		var $list = $('li'), dist,
			css = [
				'li.dist-1 { background-color:#DBFFCC; }', //green
				'li.dist-2 { background-color:#B8FF99; }',
				'li.dist-3 { background-color:#94FF66; }',
				'li.dist-4 { background-color:#FFF0CC; }', //yellow
				'li.dist-5 { background-color:#FFD166; }',
				'li.dist-6 { background-color:#FFB200; }',
				'li.dist-7 { background-color:#FFCCCC; }', //red
				'li.dist-8 { background-color:#FF9999; }',
				'li.dist-9 { background-color:#FF6666; }',
				'li.dist-10 { background-color:#FF3333; }'
			].join(' ');
		e.preventDefault();
		mw.util.addCSS( css );
		$list.each(function () {
			//Current syntax: * old word : new word //Some comment
			var match = /^\s*(\S[^:]*?)\s*:\s*([\S].*?)\s*(?:\/\/.*?)?$/.exec( $(this).text() );
			if ( match && match[1] && match[2]) {
				dist = levenshtein(match[1], match[2]);
				if (dist > 9) {
					dist = '10';
				}
				$(this).addClass('dist-' + dist ).attr('title', 'The edit distance is ' + dist);
			}
		});
	}

	if ( $.inArray( mw.config.get('wgPageName'),
		[
			'Wikisource:Modernização/Dicionário',
			'Wikisource:Modernização/Dicionário/pt-BR',
			'Wikisource:Modernização/Dicionário/pt-PT',
			'Wikipédia:Dicionário',
			'Wikipédia:Dicionário/pt-AO',
			'Wikipédia:Dicionário/pt-BR',
			'Wikipédia:Dicionário/pt-PT'
		] ) !== -1 ) {
		$(mw.util.addPortletLink('p-cactions',
			'#',
			'Display edit distance',
			'ca-Levenshtein-distance',
			'Change the background of the rules according to the edit distance between the expressions'
		)).click( addEditDistance );
	}

}( mediaWiki, jQuery ) );
