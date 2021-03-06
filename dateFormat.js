/*
 * Date Format 1.2.1
 * (c) 2010 Christian Tellnes <christian.tellnes.com>
 * MIT license
 *
 * Includes enhancements by Nick Baicoianu <meanfreepath.com>
 * and Taco van den Broek <techblog.procurios.nl>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */


function dateFormat(date, mask) {
	if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
		mask = date;
		date = undefined;
	}

	date = date ? new Date(date) : new Date();
	if (isNaN(date)) { throw new SyntaxError("invalid date"); }
	
	var dF = dateFormat, c, dt, str = '', i = 0;
	mask = dF.masks[mask] || mask || dF.masks["default"];
	while (typeof mask === "function") { mask = mask(date); }
	mask = String(mask);

	
	while ( (c=mask[i++]) ) {
		if (c == '%') {
			c = mask[i++];
			if (dF.strftimeTranslate[c]) {
				c = dF.strftimeTranslate[c];
			}
		}
		switch(c){
			case "\\":str += mask[i++]; break;
			case "d": str += dF.toPaddedString(date.getDate()); break;
			case "D": str += dF.i18n.daysShort[date.getDay()]; break;
			case "j": str += date.getDate(); break;
			case "l": str += dF.i18n.days[date.getDay()]; break;
			case "N": dt = date.getDay(); str += (dt===0)?7:dt; break;
			case "S": dt = date.getDay(); str += ["th", "st", "nd", "rd"][dt % 10 > 3 ? 0 : (dt % 100 - dt % 10 != 10) * dt % 10]; break;
			case "w": str += date.getDay(); break;
			case "z": str += date.getOrdinalNumber(); break;

			case "W": str += date.getWeek(1); break;

			case "F": str += dF.i18n.months[ date.getMonth() ]; break;
			case "m": str += dF.toPaddedString(date.getMonth()+1); break;
			case "M": str += dF.i18n.monthsShort[ date.getMonth() ]; break;
			case "n": str += date.getMonth()+1; break;
			case "t":
				switch(date.getMonth()+1) {
					case 4: case 6: case 9: case 11:str += "30"; break;
					case 2: str += (dF(date, "L")==="1")? "29" : "28"; break;
					default: str += "31"; break;
				}
				break;
				
			case "L": dt=date.getFullYear(); str += ((dt % 4 === 0 && dt % 100 !== 0) || dt % 400 === 0)?"1":"0"; break;
			case 'o': str += date.getWeekYear(); break;
			case "Y": str += date.getFullYear(); break;
			case "y": str +=  date.getFullYear().toString().substr(2,2); break;

			case "a": str += (date.getHours()<12)?'am':'pm'; break;
			case "A": str += (date.getHours()<12)?'AM':'PM'; break;
			case "g": dt=date.getHours(); str += (dt<13)?dt:dt-12; break;
			case "G": str += date.getHours(); break;
			case "h": dt=date.getHours(); str += dF.toPaddedString( (dt<13)?dt:dt-12 ); break;
			case "H": str += dF.toPaddedString(date.getHours()); break;
			case "i": str += dF.toPaddedString(date.getMinutes()); break;
			case "s": str += dF.toPaddedString(date.getSeconds()); break;
			case "u": str += date.getMilliseconds(); break;
			
			case 'e': break;
			case 'I': break;
			case 'O': dt = -date.getTimezoneOffset(); str += (dt<0 ? '-' : '+')+dF.toPaddedString(Math.floor(dt/60))+dF.toPaddedString(dt % 60); break;
			case 'P': dt = -date.getTimezoneOffset(); str += (dt<0 ? '-' : '+')+dF.toPaddedString(Math.floor(dt/60))+":"+dF.toPaddedString(dt % 60); break;
		//	case 'P': dt = -date.getTimezoneOffset()/60*100; str += (dt<0 ? '-' : '+')+dF.toPaddedString( -date.getTimezoneOffset()/60 )+':00'; break;
			case 'T': break;
			case 'Z': str += -date.getTimezoneOffset()*60; break;

			case 'c': str += dF(date, dF.masks.c); break;
			case 'r': str += dF(date, dF.masks.r); break;
			case 'U': str += date.getTime()/60; break;


			// strftime
			case '%j': str += dF.toPaddedString(date.getOrdinalNumber(), 3); break;
			case '%U': str += dF.getWeek(0); break;
			case '%W': str += dF.getWeek(1); break;
			case '%C': str += Math.floor(date.getFullYear()/100); break;
			case '%g': str += date.getWeekYear().toString().substr(2,2); break;
			
			case '%r':
			case '%R':
			case '%T':
			case '%D': 
			case '%F':
				str += dF(date, dF.masks[c]); 
				break;
			case '%X': str += dF(date, dF.i18n.masks.time); break;
			case '%c': str += dF(date, dF.i18n.masks.datetime); break;
			case '%x': str += dF(date, dF.i18n.masks.date); break;

			default: str += c; break;
        }
     }
     return str;
}
// To padded string

dateFormat.toPaddedString = function(str, length) {
	str = String(str);
	var i = (length || 2)-str.length;
	if (i <= 0) { return str; }
	while(i--) {
		str = '0'+str;
	}
	return str;
};



dateFormat.escape = function(str) {
	return '\\'+str.split('').join('\\');
};


// Some common format strings
dateFormat.masks = {
	"default": "Y-m-d\\TH:i:sP",
	
	ATOM:		'Y-m-d\\TH:i:sP',
	COOKIE:		'l, d-M-y H:i:s T',
	ISO8601:	'Y-m-d\\TH:i:sO',
	RFC822:		'D, d M y H:i:s O',
	RFC850:		'l, d-M-y H:i:s T',
	RFC1036:	'D, d M y H:i:s O',
	RFC1123:	'D, d M Y H:i:s O',
	RFC2822:	'D, d M Y H:i:s O',
	RFC3339:	'Y-m-d\\TH:i:sP',
	RSS:		'D, d M Y H:i:s O',
	W3C:		'Y-m-d\\TH:i:sP',
	
	c: 'Y-m-d\\TH:i:sO',
	r: 'D, d M Y H:i:s O',
	'%r': 'h:i:s A',
	'%R': 'H:i',
	'%T': 'H:i:s',
	'%D': 'm/d/y',
	'%F': 'Y-m-d'
};

dateFormat.i18n = {
	months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday","Friday", "Saturday"],
	daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri","Sat"],
	masks: {
		time: 'H:i:s',
		datetime: 'D, d M Y H:i:s O',
		date: 'Y-m-d'
	}
};

dateFormat.strftimeTranslate = {
	"a": "D",
	"A": "l",
	"d": "d",
	"e": "j",
	"j": "%j",
	"u": "N",
	"w": "w",

	"U": "%U",
	"V": "W",
	"W": "%W",

	"b": "M",
	"B": "F",
	"h": "M",
	"m": "m",

	"C": "%C",
	"g": "%g",
	"G": "o",
	"y": "y",
	"Y": "Y",

	"H": "H",
	"I": "h",
	"l": "g",
	"M": "i",
	"p": "A",
	"P": "a",
	"r": "%r",
	"R": "%R",
	"S": "s",
	"T": "%T",
	"X": "%X",
	"z": "e",
	"Z": "e",
	"c": "%c",
	"D": "%D",
	"F": "%F",
	"s": "U",
	"x": "%x",

	"n": "\n",
	"t": "\t",
	"%": "%"
};

// For convenience...
Date.prototype.format = function (mask) {
	return dateFormat(this, mask);
};



/**
 * Date.prototype.getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com
 * http://www.meanfreepath.com/support/getting_iso_week.html
 */
/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
Date.prototype.getWeek = function (dowOffset) {
	var newYear, day, daynum, weeknum;
	dowOffset = typeof dowOffset == 'number' ? dowOffset : 0; //default dowOffset to zero
	
	newYear = new Date(this.getFullYear(),0,1);
	day = newYear.getDay() - dowOffset; //the day of week the year begins on
	day = (day >= 0 ? day : day + 7);
	daynum = Math.floor((this.getTime() - newYear.getTime() - 
	(this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;

	//if the year starts before the middle of a week
	if(day < 4) {
		weeknum = Math.floor((daynum+day-1)/7) + 1;
		if(weeknum > 52) {
			var nYear, nDay;
			nYear = new Date(this.getFullYear() + 1,0,1);
			nDay = nYear.getDay() - dowOffset;
			nDay = nDay >= 0 ? nDay : nDay + 7;
			// if the next year starts before the middle of the week, it is week #1 of that year
			weeknum = nDay < 4 ? 1 : 53;
		}
	}
	else {
		weeknum = Math.floor((daynum+day-1)/7);
		if (weeknum < 1) { weeknum = 53; }
	}
	return weeknum;
};


/**
 * Date.prototype.getWeekYear() was developed by Taco van den Broek at Procurios: http://techblog.procurios.nl/
 * http://techblog.procurios.nl/k/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html
 */
/**
* Get the ISO week date year number
*/
Date.prototype.getWeekYear = function () {
	// Create a new date object for the thursday of this week
	var target	= new Date(this.valueOf());
	target.setDate(target.getDate() - ((this.getDay() + 6) % 7) + 3);
	
	return target.getFullYear();
};


Date.prototype.getOrdinalNumber = function () {
	return Math.floor( (this - new Date(this.getFullYear(), 0, 1)) / 86400000);
};



// If is node
if (this.module && 'exports' in module) {
	module.exports = dateFormat;
}
