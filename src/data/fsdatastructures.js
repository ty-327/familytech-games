export default class Tree {
    constructor(){
		//map of ascendancy number to index
		this.personMap = new Map();
	}

	setPersons(personMap) {
		this.personMap = personMap;
	}
    
    addPerson = function(person) {
        this.personMap.set(person.a_num, person);
    }
	getPerson = function(a_num) {
		return this.personMap.get(a_num.toString());
	}
	getSpouse = function(a_num) {
		let person = this.getPerson(a_num);
		if (person == null) { return null; }
		if (person.gender == "Male") {
			let spouse = this.getPerson(a_num + 1);
			if (spouse.gender == "Female") { return spouse; }
			else { return null; }
		}
		else { return this.getPerson(a_num - 1); }
		
	}
	getFather = function(a_num) {
		let child = this.getPerson(a_num);
		if (child == null) { return null; }
		let fa_num = (2 * a_num);
		return this.getPerson(fa_num);
	}
	getMother = function(a_num) {
		let child = this.getPerson(a_num);
		if (child == null) { return null; }
		let ma_num = (2 * a_num) + 1;
		return this.getPerson(ma_num);
	}
	getChild = function(a_num) {
		let parent = this.getPerson(a_num);
		if (parent == null) { return null; }
		if (parent.gender == "Male") { return this.getPerson(a_num / 2); }
		else {return this.getPerson((a_num - 1) / 2); }
	}

	insertRelationships = function(relationships) {
		var pidMap = new Map();
		for (const person of this.personMap.values()) {
			pidMap.set(person.pid, person.a_num);
		}

		for (const relationship of relationships){
			if (!relationship.facts) continue;
			if (relationship.facts[0].type == "http://gedcomx.org/Marriage") {
				let person1 = this.personMap.get(pidMap.get(relationship.person1.resourceId));
				let person2 = this.personMap.get(pidMap.get(relationship.person2.resourceId));
				if (person1 && person2 && relationship.facts[0].date) person1.addMarriageDate(relationship.facts[0].date.original);
				if (person1 && person2 && relationship.facts[0].place) person1.addMarriagePlace(relationship.facts[0].place.original);
				if (person1 && person2 && relationship.facts[0].date) person2.addMarriageDate(relationship.facts[0].date.original);
				if (person1 && person2 && relationship.facts[0].place) person2.addMarriagePlace(relationship.facts[0].place.original);
			}
		};
	}
}

export class Person {
    constructor(data) {
        
      this.name = new Name(data);
	    this.gender = data.display.gender;
			this.living = data.living;

			this.a_num = parseInt(data.display.ascendancyNumber) || undefined; //used as a pid
      this.generation = (this.a_num << 0).toString(2).length;
			this.pid = data.id; //unused

			this.birthDate = new MyDate(data.display.birthDate);
			this.deathDate = new MyDate(data.display.deathDate);

			this.birthPlace = normalizePlace(data.display.birthPlace);
			this.deathPlace = normalizePlace(data.display.deathPlace);

			var lifespanArray = data.display.lifespan.split('-');
			var lifespanBirth = lifespanArray.length > 0 ? parseInt(lifespanArray[0]) : undefined;
			var lifespanDeath = lifespanArray.length > 1 ? parseInt(lifespanArray[1]) : undefined;

			this.lifespan = {
					string: data.display.lifespan,
					birth: lifespanBirth,
					death: lifespanDeath,
					years: lifespanBirth && lifespanDeath ? lifespanDeath - lifespanBirth : undefined,
					toString: function() { return this.string; },
					equals: function(other) {
							return other.birth == this.birth && other.death == this.death;
					}
			}

		this.occupation = getOccupation(data);
    }

	addMarriageDate = function(marriageDate) {
		this.marriageDate = new MyDate(marriageDate);
	}

	addMarriagePlace = function(marriagePlace) {
		this.marriagePlace = normalizePlace(marriagePlace);
	}
}

class MyDate {
    constructor(date) {
        var day, month, year;

        if (date) {
            var arr = date.split(' ');
            for (var i in arr) {
                var elem = arr[i];
                var num = parseInt(elem)
                if (num > 0 && num < 32)
                    day = num.toString();
                else if (isNaN(num))
                    month = months[elem.toLowerCase()];
                else if (elem.length == 4)
                    year = elem;
            }
	    }

        this.day = day;
        this.month = month;
        this.year = year;
        this.original = date;
    }
}

var months = {
	'january':'January',
	'jan':'January',
	'february':'February',
	'feb':'February',
	'mar':'March',
	'march':'March',
	'apr':'April',
	'april':'April',
	'may':'May',
	'jun':'June',
	'june':'June',
	'july':'July',
	'jul':'July',
	'august':'August',
	'aug':'August',
	'september':'September',
	'sept':'September',
	'october':'October',
	'oct':'October',
	'november':'November',
	'nov':'November',
	'december':'December',
	'dec':'December'
}

class Name {
    constructor(person) {
        let given;
        let surname;

        let names = person.names;
        if (names) {
            let preferredNameIndex = 0
            let counter = 0
            while (counter < names.length && !names[counter].preferred) {
                counter++
            }
            if (names[counter].preferred) {
                preferredNameIndex = counter
            }
            let forms = names[preferredNameIndex].nameForms
            if (forms && forms[0]) {
                let parts = forms[0].parts
                for (let i in parts) {
                    if (parts[i].type === "http://gedcomx.org/Given") {
                        let name = parts[i].value
                        if (name.toLowerCase() !== "unknown") {
                            given = name
                        }
                    }
                    else if (parts[i].type === "http://gedcomx.org/Surname") {
                        let name = parts[i].value
                        if (name.toLowerCase() !== "unknown") {
                            surname = name;
                        }
                    }
                }
            }
        }

        this.full = person.display.name;
        this.given = given;
        this.first = given ? given.split(' ')[0] : undefined;
        //this.middle = given ? given.replace(this.first + " ", '') : undefined;
        this.last = surname;
				this.compressedName = (this.first.replace(/\s/g, '') + this.last.replace(/\s/g, '')).toUpperCase();
				//this.compressedName = this.full.replace(/[\s.,-]/g, '').toUpperCase();
        this.isFull = !!this.full && !!given && !!surname;
    }
}

var normalizePlace = function(place) {
	if (place) {
		var array = place.split(/,\s*/);

		var country = getCountry(place);
		if (country)
			array[array.length - 1] = country;

		//remove duplicates
		for (var i in array) {
			for (var j in array) {
				if (i != j && array[i] == array[j]) {
					array.splice(i, 1);
				}
			}
		}

		//remove blanks
		for (var i in array) {
			if (array[i].search(/[a-zA-Z]/) < 0)
				array.splice(i, 1);
		}

		if (array.length > 3) {
			array.splice(1, array.length - 3);
		}

		return array.join(', ');
	}
}

function getOccupation(person) {
	if (!person.facts || !person.facts.length) return undefined
	for (let f of person.facts) {
		if (f.type == "http://gedcomx.org/Occupation" && f.value) {
			if (f.value.includes("Laborer") || f.value.includes("Retired")) continue;
			return f.value;
		}
	}
	return undefined
}

function getCountry(place) {
	if (place) {
		var arr = place.split(/,\s*/);
		var key = arr[arr.length-1].toLowerCase().split('.').join('');
		return countryMap[key];
	}
	return undefined
}

var countryMap = {
	'us':'United States',
	'usa':'United States',
	'united states':'United States',
	'united states of america':'United States',
	'alabama':'United States',
	'al':'United States',
	'alaska':'United States',
	'ak':'United States',
	'arizona':'United States',
	'ar':'United States',
	'arkansas':'United States',
	'ar':'United States',
	'california':'United States',
	'ca':'United States',
	'cal':'United States',
	'colorado':'United States',
	'co':'United States',
	'connecticut':'United States',
	'ct':'United States',
	'conn':'United States',
	'delaware':'United States',
	'de':'United States',
	'florida':'United States',
	'fl':'United States',
	'georgia':'United States',
	'ga':'United States',
	'hawaii':'United States',
	'hi':'United States',
	'idaho':'United States',
	'id':'United States',
	'illinois':'United States',
	'il':'United States',
	'indiana':'United States',
	'in':'United States',
	'iowa':'United States',
	'ia':'United States',
	'kansas':'United States',
	'ks':'United States',
	'kentucky':'United States',
	'ky':'United States',
	'louisianna':'United States',
	'la':'United States',
	'main':'United States',
	'me':'United States',
	'maryland':'United States',
	'md':'United States',
	'massachusetts':'United States',
	'ma':'United States',
	'michigan':'United States',
	'mi':'United States',
	'minnesota':'United States',
	'mn':'United States',
	'mississippi':'United States',
	'ms':'United States',
	'missouri':'United States',
	'mo':'United States',
	'montana':'United States',
	'mt':'United States',
	'nebraska':'United States',
	'ne':'United States',
	'nevada':'United States',
	'nv':'United States',
	'new hampshire':'United States',
	'nh':'United States',
	'new jersey':'United States',
	'nj':'United States',
	'new mexico':'United States',
	'nm':'United States',
	'new york':'United States',
	'ny':'United States',
	'north carolina':'United States',
	'nc':'United States',
	'north dakota':'United States',
	'nd':'United States',
	'ohio':'United States',
	'oh':'United States',
	'oklahoma':'United States',
	'ok':'United States',
	'oregon':'United States',
	'or':'United States',
	'pennsylvania':'United States',
	'pa':'United States',
	'penn':'United States',
	'rhode island':'United States',
	'ri':'United States',
	'south carolina':'United States',
	'sc':'United States',
	'south dakota':'United States',
	'sd':'United States',
	'tennessee':'United States',
	'tn':'United States',
	'texas':'United States',
	'tx':'United States',
	'utah territory':'United States',
	'utah':'United States',
	'ut':'United States',
	'vermont':'United States',
	'vt':'United States',
	'virginia':'United States',
	'va':'United States',
	'washington':'United States',
	'wa':'United States',
	'west virginia':'United States',
	'wv':'United States',
	'wisconsin':'United States',
	'wi':'United States',
	'wyoming':'United States',
	'wy':'United States',

	'afghanistan': 'Afghanistan',

	'al':'Albania',
	'alb':'Albania',
	'albania':'Albania',

	'algeria':'Algeria',

	'ad':'Andorra',
	'add':'Andorra',
	'andorra':'Andorra',

	'angola':'Angola',

	'anguilla':'Aungilla',

	'antigua and barbuda':'Antigua and Barbuda',
	'antigua':'Antigua and Barbuda',
	'barbuda':'Antigua and Barbuda',
	'antigua & barbuda':'Antigua and Barbuda',

	'argentina':'Argentina',

	'am':'Armenia',
	'arm':'Armenia',
	'armenia':'Armenia',

	'aruba':'Aruba',

	'australia':'Australia',

	'at':'Austria',
	'aut':'Austria',
	'austria':'Austria',

	'az':'Azerbaijan',
	'aze':'Azerbaijan',
	'azerbaijan':'Azerbaijan',

	'bahamas':'Bahamas',

	'bahrain':'Bahrain',

	'bangladesh':'Bangladesh',

	'barbados':'Barbados',

	'by':'Belarus',
	'blr':'Belarus',
	'belarus':'Belarus',

	'be':'Belgium',
	'bel':'Belgium',
	'belgium':'Belgium',

	'belize':'Belize',
	'belice':'Belize',

	'benin':'Benin',

	'bemuda':'Bermuda',

	'bhutan':'Bhutan',

	'bolivia':'Bolivia',

	'ba':'Bosnia and Herzegovina',
	'bih':'Bosnia and Herzegovina',
	'bosnia and herzegovina':'Bosnia and Herzegovina',

	'botswana':'Botswana',

	'brazil':'Brazil',

	'british virgin islands':'British Virgin Islands',

	'brunei':'Brunei',

	'bg':'Bulgaria',
	'bgr':'Bulgaria',
	'bulgaria':'Bulgaria',

	'burkina faso':'Burkina Faso',

	'burundi':'Burundi',

	'cabo verde':'Cabo Verde',
	'cape verde':'Cabo Verde',
	'verde cape':'Cabo Verde',
	'cape green':'Cabo Verde',
	'green cape':'Cabo Verde',

	'cambodia':'Cambodia',

	'cameroon':'Cameroon',

	'canada':'Canada',

	'cayman islands':'Cayman Islands',

	'central african republic':'Central African Republic',

	'chad':'Chad',

	'chile':'Chile',

	'china':'China',

	'colombia':'Colombia',
	'columbia':'Colombia',

	'comoros':'Comoros',

	'cook islands':'Cook Islands',

	'democratic republic of the congo':'Democratic Republic of the Congo',

	'republic of the congo':'Republic of the Congo',
	'congo':'Republic of the Congo',

	'costa rica':'Costa Rica',

	'cote d\'ivoire':'Cote D\'Ivoire',
	'ivory coast':'Cote D\'Ivoire',


	'hr':'Croatia',
	'hrv':'Croatia',
	'croatia':'Croatia',

	'cuba':'Cuba',

	'cy':'Cyprus',
	'cyp':'Cyprus',
	'cyprus':'Cyprus',

	'cz':'Czech Republic',
	'cze':'Czech Republic',
	'czech republic':'Czech Republic',

	'dk':'Denmark',
	'dnk':'Denmark',
	'danmark':'Denmark',
	'dnmk':'Denmark',
	'denmark':'Denmark',

	'djibouti':'Djibouti',

	'dominica':'Dominica',

	'Dominican Republic':'Dominican Republic',
	'dr':'Dominican Republic',

	'ecuador':'Ecuador',

	'egypt':'Egypt',

	'el salvador':'El Salvador',
	'salvador':'El Salvador',

	'equatorial guinea':'Equatorial Guinea',

	'eritrea':'Eritrea',

	'ee':'Estonia',
	'est':'Estonia',
	'estonia':'Estonia',

	'ethopia':'Ethiopia',

	'falkland islands':'Falkland Islands',

	'faroe islands':'Faroe Islands',

	'fiji':'Fiji',

	'fi':'Finland',
	'fin':'Finland',
	'finland':'Finland',

	'fr':'France',
	'fra':'France',
	'france':'France',

	'french polynesia':'French Polynesia',

	'french west indies':'French West Indies',

	'gabon':'Gabon',

	'gambia':'Gambia',

	'ge':'Georgia',
	'geo':'Georgia',
	'georgia':'Georgia',

	'de':'Germany',
	'deu':'Germany',
	'germany':'Germany',

	'ghana':'Ghana',

	'gibraltar':'Gibraltar',

	'gr':'Greece',
	'grc':'Greece',
	'greece':'Greece',

	'greenland':'Greenland',

	'grenada':'Grenada',

	'guam':'Guam',

	'guatemala':'Guatemala',

	'geurnsey':'Geurnsey',

	'guinea':'Guinea',

	'guinea-bissau':'Guinea-Bissau',
	'guinea bissau':'Guinea-Bissau',
	'guineabissau':'Guinea-Bissau',

	'guyana':'Guyana',

	'haiti':'Haiti',

	'honduras':'Honduras',

	'hong kong':'Hong Kong',

	'hu':'Hungary',
	'hun':'Hungary',
	'hungary':'Hungary',

	'is':'Iceland',
	'isl':'Iceland',
	'iceland':'Iceland',

	'india':'India',

	'indonesia':'Indonesia',

	'iran':'Iran',

	'iraq':'Iraq',

	'ie':'Ireland',
	'irl':'Ireland',
	'ireland':'Ireland',

	'isle of man':'Isle of Man',

	'israel':'Israel',

	'it':'Italy',
	'ita':'Italy',
	'italy':'Italy',

	'jamaica':'Jamaica',

	'japan':'Japan',

	'jersey':'Jersey',

	'jordan':'Jordan',

	'kazakhstan':'Kazakhstan',
	'kazakstan':'Kazakhstan',

	'kenya':'Kenya',

	'kiribati':'Kiribati',

	'kosovo':'Kosovo',

	'kuwait':'Kuwait',

	'kyrgyzstan':'Kyrgystan',

	'kyrgyz republic':'Kyrgyz Republic',
	'kyrgyz':'Kyrgyz Republic',

	'laos':'Laos',

	'latvia':'Latvia',

	'lebanon':'Lebanon',

	'lesotho':'Lesotho',

	'liberia':'Liberia',

	'libya':'Libya',
	'libia':'Libya',

	'li':'Liechtenstein',
	'lie':'Liechtenstein',
	'liechtenstein':'Liechtenstein',

	'lt':'Lithuania',
	'ltu':'Lithuania',
	'lithuania':'Lithuania',

	'lu':'Luxembourg',
	'lux':'Luxembourg',
	'luxembourg':'Luxembourg',

	'macau':'Macau',

	'macedonia':'Macedonia',

	'madagascar':'Madagascar',

	'malawi':'Malawi',

	'malaysia':'Malaysia',

	'maldives':'Maldives',

	'mali':'Mali',

	'malta':'Malta',

	'marshall islands':'Marshall Islands',

	'mauritania':'Mauritania',

	'mauritius':'Mauritius',

	'mexico':'Mexico',
	'mejico':'Mexico',

	'micronesia':'Micronesia',

	'moldova':'Moldova',

	'monaco':'Monaco',

	'mongolia':'Mongolia',

	'montenegro':'Montenegro',

	'montserrat':'Montserrat',
	'montserat':'Montserrat',

	'morocco':'Morocco',
	'moroco':'Morocco',

	'mozambique':'Mozambique',

	'myanmar':'Myanmar',

	'burma':'Myanmar',

	'namibia':'Namibia',

	'nauru':'Nauru',

	'nepal':'Nepal',

	'nl':'Netherlands',
	'nld':'Netherlands',
	'netherlands':'Netherlands',

	'netherlands antilles':'Netherlands Antilles',
	'antilles':'Netherlands Antilles',

	'new caledonia':'New Caledonia',

	'new zealand':'New Zealand',

	'nicaragua':'Nicaragua',

	'niger':'Niger',

	'nigeria':'Nigeria',

	'north korea':'North Korea',

	'no':'Norway',
	'nor':'Norway',
	'norway':'Norway',

	'oman':'Oman',

	'ottoman empire':'Ottoman Empire',

	'pakistan':'Pakistan',

	'palau':'Palau',

	'palestine':'Palestine',

	'panama':'Panama',

	'papua new guinea':'Papua New Guinea',
	'papa new guinea':'Papua New Guinea',

	'paraguay':'Paraguay',

	'peru':'Peru',

	'philippines':'Philippines',

	'pl':'Poland',
	'pol':'Poland',
	'poland':'Poland',

	'pt':'Portugal',
	'prt':'Portugal',
	'portugal':'Portugal',

	'prussia':'Prussia',

	'puerto rico':'Puerto Rico',
	'porta rico':'Puerto Rico',
	'porto rico':'Puerto Rico',

	'qatar':'Qatar',

	'reunion':'Reunion',

	'ro':'Romania',
	'rou':'Romania',
	'romania':'Romania',

	'ru':'Russia',
	'rus':'Russia',
	'russia':'Russia',

	'rwanda':'Rwanda',

	'saint kitts and nevis':'Saint Kitts and Nevis',
	'st kitts and nevis':'Saint Kitts and Nevis',
	'st. kitts and nevis':'Saint Kitts and Nevis',
	'saint kitts & nevis':'Saint Kitts and Nevis',
	'st kitts & nevis':'Saint Kitts and Nevis',
	'st. kitts & nevix':'Saint Kitts and Nevis',

	'saint lucia':'Saint Lucia',
	'st lucia':'Saint Lucia',
	'st. lucia':'Saint Luica',

	'saint pierre and miquelon':'Saint Pierre and Miquelon',
	'st pierre and miquelon':'Saint Pierre and Miquelon',
	'st. pierre and miquelon':'Saint Pierre and Miquelon',
	'saint pierre & miquelon':'Saint Pierre and Miquelon',
	'st pierre & miquelon':'Saint Pierre and Miquelon',
	'st. pierre & miquelon':'Saint Pierre and Miquelon',

	'saint vincent and the grenadines':'Saint Vincent and the Grenadines',
	'st vincent and the grenadines':'Saint Vincent and the Grenadines',
	'st. vincent and the grenadines':'Saint Vincent and the Grenadines',
	'saint vincent & the grenadines':'Saint Vincent and the Grenadines',
	'st vincent & the grenadines':'Saint Vincent and the Grenadines',
	'st. vincent & the grenadines':'Saint Vincent and the Grenadines',
	'saint vincent and grenadines':'Saint Vincent and the Grenadines',
	'st vincent and grenadines':'Saint Vincent and the Grenadines',
	'st. vincent and grenadines':'Saint Vincent and the Grenadines',
	'saint vincent & grenadines':'Saint Vincent and the Grenadines',
	'st vincent & grenadines':'Saint Vincent and the Grenadines',
	'st. vincent & grenadines':'Saint Vincent and the Grenadines',

	'samoa':'Samoa',

	'san marino':'San Marino',

	'sao tome and principe':'Sao Tome and Principe',
	'saint thomas and prince':'Sao Tome and Principe',
	'sao tome & principe':'Sao Tome and Principe',
	'saint thomas and principe':'Sao Tome and Principe',
	'saint thomas & prince':'Sao Tome and Principe',

	'saudi arabia':'Saudi Arabia',

	'senegal':'Senegal',

	'rs':'Serbia',
	'srb':'Serbia',
	'serbia':'Serbia',

	'seychelles':'Seychelles',

	'sierra leone':'Sierre Leone',

	'singapore':'Singapore',

	'sk':'Slovakia',
	'svk':'Slovakia',
	'slovakia':'Slovakia',

	'si':'Slovenia',
	'svn':'Slovenia',
	'slovenia':'Slovenia',

	'solomon islands':'Solomon Islands',

	'somalia':'Somalia',

	'south africa':'South Africa',

	'south korea':'South Korea',

	'south sudan':'South Sudan',

	'es':'Spain',
	'esp':'Spain',
	'spain':'Spain',

	'sri lanka':'Sri Lanka',

	'sudan':'Sudan',

	'suriname':'Suriname',

	'swaziland':'Swaziland',

	'se':'Sweden',
	'see':'Sweden',
	'swed':'Sweden',
	'sweden':'Sweden',
	'sverige':'Sweden',

	'ch':'Switzerland',
	'che':'Switzerland',
	'switzerland':'Switzerland',

	'syria':'Syria',

	'taiwan':'Taiwan',

	'tajikistan':'Tajikistan',
	'tajikstan':'Tajikistan',

	'tanzania':'Tanzania',

	'thailand':'Thailand',

	'timor-leste':'Timor-Leste',
	'timor leste':'Timor-Leste',
	'timorleste':'Timor-Leste',

	'togo':'Togo',

	'tonga':'Tonga',

	'trinidad and tobago':'Trinidad and Tobago',
	'trinidad & tobago':'Trinidad and Tobago',

	'tunisia':'Tunisia',

	'tr':'Turkey',
	'tur':'Turkey',
	'turkey':'Turkey',

	'turkmenistan':'Turkmenistan',
	'turkestan':'Turkmenistan',

	'turks and caicos':'Turks and Caicos',
	'turks & caicos':'Turks and Caicos',

	'tuvalu':'Tuvalu',

	'uganda':'Uganda',

	'ua':'Ukraine',
	'ukr':'Ukraine',
	'ukraine':'Ukraine',

	'united arab emirates':'United Arab Emirates',

	'scotland':'United Kingdom',
	'scot':'United Kingdom',
	'gb':'United Kingdom',
	'gbr':'United Kingdom',
	'uk':'United Kingdom',
	'en':'United Kingdom',
	'eng':'United Kingdom',
	'england':'United Kingdom',
	'great britain':'United Kingdom',
	'united kingdom':'United Kingdom',

	'uruguay':'Uruguay',

	'uzbekistan':'Uzbekistan',

	'vanuatu':'Vanuatu',
	'vanautu':'Vanuatu',

	'vatican city':'Vatican City',
	'holy see':'Vatican City',
	'vatican':'Vatican City',
	'the vatican':'Vatican City',
	'the vatican city':'Vatican City',
	'the holy see':'Vatican City',

	'venezuela':'Venezuela',

	'vietnam':'Vietnam',

	'virgin islands':'Virgin Islands',

	'yemen':'Yemen',

	'zambia':'Zambia',

	'zimbabwe':'Zimbabwe',
	'rhodesia':'Zimbabwe',
	'rodesia':'Zimbabwe',

	'england':'England',

	'scotland':'Scotland',

	'wales':'Wales',

	'northern ireland':'Northern Ireland',
	'n ireland':'Northern Ireland',
	'n. ireland':'Northern Ireland'
}