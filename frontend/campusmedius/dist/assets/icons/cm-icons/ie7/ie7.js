/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'cm-icons\'">' + entity + '</span>' + html;
	}
	var icons = {
		'cm-audio': '&#xe900;',
		'cm-camera': '&#xe901;',
		'cm-chevron-bold-down': '&#xe902;',
		'cm-chevron-bold-left': '&#xe903;',
		'cm-chevron-bold-right': '&#xe904;',
		'cm-chevron-bold-up': '&#xe905;',
		'cm-chevron-double-down': '&#xe906;',
		'cm-chevron-double-left': '&#xe907;',
		'cm-chevron-double-right': '&#xe908;',
		'cm-chevron-double-up': '&#xe909;',
		'cm-chevron-down': '&#xe90a;',
		'cm-chevron-left': '&#xe90b;',
		'cm-chevron-right': '&#xe90c;',
		'cm-chevron-up': '&#xe90d;',
		'cm-close': '&#xe90e;',
		'cm-external-link': '&#xe90f;',
		'cm-film': '&#xe910;',
		'cm-layers': '&#xe911;',
		'cm-menu': '&#xe912;',
		'cm-microphone': '&#xe913;',
		'cm-minus': '&#xe914;',
		'cm-plus': '&#xe915;',
		'cm-quote': '&#xe916;',
		'cm-seperator': '&#xe917;',
		'cm-square-audio': '&#xe918;',
		'cm-square-camera': '&#xe919;',
		'cm-square-close': '&#xe91a;',
		'cm-square-external-link': '&#xe91b;',
		'cm-square-film': '&#xe91c;',
		'cm-square-layers': '&#xe91d;',
		'cm-square-microphone': '&#xe91e;',
		'cm-square-minus': '&#xe91f;',
		'cm-square-plus': '&#xe920;',
		'cm-square-quote': '&#xe921;',
		'cm-square-zoom': '&#xe922;',
		'cm-topology-circle-examininggaze': '&#xe923;',
		'cm-topology-circle-governedtransmission': '&#xe924;',
		'cm-topology-circle-sovereignsign': '&#xe925;',
		'cm-topology-examininggaze': '&#xe926;',
		'cm-topology-governedtransmission': '&#xe927;',
		'cm-topology-sovereignsign': '&#xe928;',
		'cm-zoom': '&#xe929;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/cm-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
