// SLIKS-Alike Interactive Key Software (SAIKS)
// Inspired by SLIKS from http://stingersplace.com/SLIKS/ by Gerald F. Guala
// Copyright (c) 2006 Greg Alexander, to be distributed under the terms of
// the GPLv2 (COPYING)

var first_row = 1;	// to skip chars[0] and items[0] for SLIKS compat
var char_flags = new Array();
// == 0   -->  initial state, is selectable
// == 1   -->  currently selected characteristic (click to unselect)
// == 2   -->  grayed out (obviated characteristic)
// == 3   -->  intermediate state...this unselected option is a possibility
var taxa_flags = new Array();
// == 0   -->  not a possible match
// == 1   --> a possible match

// these are initialized by *_table() to work around the fact that MSIE
// (et al?) have a distinct lack of document.getElementById()
var char_elems = new Array();
var taxa_elems = new Array();

var exclusive_mode;		// whether or not exclusive is currently set

// find width of characteristics table
function find_max_char_cols() {
	var i;
	var max=0;
	for (i = first_row; i < chars.length; i++) {
		if (chars[i].length > max) {
			max = chars[i].length;
		}
	}
	return max;
}

// emit characteristics table
function chars_table() {
	var max_char_cols = find_max_char_cols();
	var i;
	var j;
	var k;

	document.write("<table border=1>\n");

	for (i = first_row; i < chars.length; i++) {
		document.write("<tr>");
		for (j = 0; j < max_char_cols; j++) {
			if (j < chars[i].length) {
				document.write("<td id=\"char"+i+"m"+j+"\" onClick=\"toggle_char("+i+","+j+");\">");
				document.write(chars[i][j]);
				document.write("</td>\n");
			} else {
				document.write("<td> </td>\n");
			}
		}
		document.write("</tr>");
	}

	document.write("</table>");

	// this could be improved slightly by getting just the tds
	// associated with the table we want, but it seems that simply not
	// referencing document.all is enough to guarantee decent performance,
	// even on firefox!
	var elemlist = document.getElementsByTagName("td");
	var len = elemlist.length;
	for (i = 0; i < len; i++) {
		if (elemlist[i].id.substr(0,4) == "char") {
			var s;
			s = elemlist[i].id.substr(4);
			k = s.indexOf("m");
			j = s.substr(0,k)-0;
			k = s.substr(k+1)-0;
			if (!char_elems[j]) {
				char_elems[j] = new Array();
			}
			char_elems[j][k] = elemlist[i];
		}
	}
}

// emit taxa table
function taxa_table() {
	document.write("<table border=1>");
	for (i = first_row; i < items.length; i++) {
		document.write("<tr><td id=\"taxa"+i+"\" onClick=\"select_taxa("+i+");\">"+items[i][0]+"</td><td>");
		if (items[i][chars.length]) {
			document.write("<a href=\""+items[i][chars.length]+"\">link</a>");
		}
		document.write("</td></tr>\n");
	}

	document.write("</table>");

	var elemlist = document.getElementsByTagName("td");
	var len = elemlist.length;
	for (i = 0; i < len; i++) {
		if (elemlist[i].id.substr(0,4) == "taxa") {
			taxa_elems[elemlist[i].id.substr(4)-0] = elemlist[i];
		}
	}
}

// inits the list of the currently selected characteristics
function init_char_flags() {
	var i;
	var j;
	for (i = first_row; i < chars.length; i++) {
		char_flags[i] = new Array();
		for (j = 1; j < chars[i].length; j++) {
			char_flags[i][j] = 0;
		}
	}
}

// toggles characteristic (i,j) in the table
function toggle_char(i, j) {
	if (char_flags[i][j] == 1) {
		char_flags[i][j] = 0;
	} else {
		if (exclusive_mode) {
			// in exclusive mode, selecting something unselects
			// the other characteristics
			var k;
			for (k = 1; k < char_flags[i].length; k++) {
				char_flags[i][k] = 0;
			}
		}
		char_flags[i][j] = 1;
	}
	update();
}

// sets the characteristics for a specific taxa
function select_taxa(i) {
	var j;
	var k;

	init_char_flags();		// reset everything to defaults first

	for (j = first_row; j < chars.length; j++) {
		if (items[i][j] == "?") {
			// wildcard -- set them all
			for (k = 0; k < char_flags[j].length; k++) {
				char_flags[j][k] = 1;
			}
		} else {
			for (k = 0; k < items[i][j].length; k++) {
				char_flags[j][parseInt(items[i][j].charAt(k),36)] = 1;
			}
		}
	}

	update();
}

// do whatever appropriate browser magic to set the background color of
// the specified CSS ID
function set_bgcolor(elem, color) {
	var i;

	elem.setAttribute("bgColor",color);
}

// update the visual aspect of the characteristics table from char_flags
function update_chars() {
	var i;
	var j;

	for (i = first_row; i < chars.length; i++) {
		for (j = 1; j < char_flags[i].length; j++) {
			if (char_flags[i][j] == 2) {
				set_bgcolor(char_elems[i][j], "#7777AA");
			} else if (char_flags[i][j] == 1) {
				set_bgcolor(char_elems[i][j], "#00FF00");
			} else {
				set_bgcolor(char_elems[i][j], "#AAAAFF");
			}
		}
	}
}

// see if anything in the characteristics row i is selected
function any_in_row_selected(i) {
	for (j = 1; j < char_flags[i].length; j++) {
		if (char_flags[i][j] == 1) {
			return 1;
		}
	}
	return 0;
}

// update the taxa table to visually match the taxa_flags array
function update_taxa() {
	var i;
	var j;

	for (i = first_row; i < items.length; i++) {
		if (taxa_flags[i] == 1) {
			set_bgcolor(taxa_elems[i], "#00FF00");
		} else {
			set_bgcolor(taxa_elems[i], "#FF4444");
		}
	}
}

// given the current state of char_flags, compute taxa_flags
// (possible matching taxa)
function compute_taxa() {
	var i;
	var j;
	var k;
	var disp;
	var sub_disp;

	for (i = first_row; i < items.length; i++) {
		disp = 1;
		for (j = first_row; j < chars.length; j++) {
			if (items[i][j] == "?") {
				// wildcard, matches everything
			} else if (!any_in_row_selected(j)) {
				// nothing selected, assume match
			} else {
				// disp remains only if the corresponding
				// element of char_flags is set
				sub_disp = 0;
				for (k = 0; k < items[i][j].length; k++) {
					if (char_flags[j][parseInt(items[i][j].charAt(k),36)] == 1) {
						sub_disp = 1;
					}
				}
				if (sub_disp == 0) {
					disp = 0;
				}
			}

		}
		taxa_flags[i] = disp;
	}
}

// some selections obviate others (set char_flags to 2 for obviated ones)
function compute_obviates() {
	var i;
	var j;
	var k;
	var match_everything;

	for (i = first_row; i < chars.length; i++) {
		if (!any_in_row_selected(i)) {
			match_everything = 0;
			// first mark all possibilities with flag 3
			for (j = first_row; j < items.length; j++) {
				if (taxa_flags[j] == 1) {
					if (items[j][i] == "?") {
						// wildcard - match everything
						match_everything = 1;
						break;
					} else {
						for (k = 0; k < items[j][i].length; k++) {
							char_flags[i][parseInt(items[j][i].charAt(k), 36)] = 3;
						}
					}
				}
			}

			// now reverse it, so that unpossibilities have flag 2
			for (j = first_row; j < char_flags[i].length; j++) {
				if (match_everything || char_flags[i][j] == 3) {
					char_flags[i][j] = 0;
				} else {
					char_flags[i][j] = 2;
				}
			}
		}
	}
}

function update() {
	compute_taxa();
	compute_obviates();
	update_chars();
	update_taxa();
}

function do_reset() {
	init_char_flags();
	update();
}

var butt_exc;

function do_exclusive() {
	if (!butt_exc) {
		var elemlist = document.getElementsByTagName("input");
		var len = elemlist.length;
		var i;
		for (i = 0; i < len; i++) {
			if (elemlist[i].id == "exclusive") {
				butt_exc = elemlist[i];
			}
		}
	}

	exclusive_mode = !!butt_exc.checked;
}


function main() {
	// output the button bar along the top
	document.write("<form>\n");
	document.write("<table><tr>\n");
	document.write("<td><input type=\"submit\" value=\"RESET\" onClick=\"do_reset();\"></td>\n");
	// checked --> default
	document.write("<td><input type=\"checkbox\" onChange=\"do_exclusive();\" id=\"exclusive\" checked>Exclusive</td>\n");
	document.write("</table><br>\n");
	document.write("</form>\n");

	document.write("<table width=100%><tr><td width=70% valign=top align=center>\n");
	chars_table();
	document.write("</td><td width=30% valign=top align=center>\n");
	taxa_table();
	document.write("</td></tr></table>\n");

	do_exclusive();			// set exclusive_mode from checkbox

	init_char_flags();
	update();
}
