(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ldv = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports={
  "author": "Spencer Kelly <spencermountain@gmail.com> (http://spencermounta.in)",
  "name": "kompromiss",
  "description": "Computerlinguistik im browser",
  "version": "0.0.1",
  "main": "./builds/kompromiss.js",
  "repository": {
    "type": "git",
    "url": "git://github.com/nlp-compromise/de-compromise.git"
  },
  "scripts": {
    "test": "node ./scripts/test.js",
    "build": "node ./scripts/build/index.js",
    "demo": "node ./scripts/demo.js",
    "watch": "node ./scripts/watch.js"
  },
  "files": [
    "builds/",
    "docs/"
  ],
  "dependencies": {},
  "devDependencies": {
    "babel-preset-es2015": "^6.24.0",
    "babelify": "7.3.0",
    "babili": "0.0.11",
    "browserify": "13.0.1",
    "browserify-glob": "^0.2.0",
    "bundle-collapser": "^1.2.1",
    "chalk": "^1.1.3",
    "codacy-coverage": "^2.0.0",
    "derequire": "^2.0.3",
    "efrt": "0.0.6",
    "eslint": "^3.1.1",
    "gaze": "^1.1.1",
    "http-server": "0.9.0",
    "nlp-corpus": "latest",
    "nyc": "^8.4.0",
    "shelljs": "^0.7.2",
    "tap-min": "^1.1.0",
    "tap-spec": "4.1.1",
    "tape": "4.6.0",
    "uglify-js": "2.7.0"
  },
  "license": "MIT"
}

},{}],2:[function(_dereq_,module,exports){
'use strict';
const tagset = _dereq_('./tagset');

// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const c = {
  reset: '\x1b[0m',
  red : '\x1b[31m',
  green : '\x1b[32m',
  yellow : '\x1b[33m',
  blue : '\x1b[34m',
  magenta : '\x1b[35m',
  cyan : '\x1b[36m',
  black: '\x1b[30m'
};
//dont use colors on client-side
if (typeof module === 'undefined') {
  Object.keys(c).forEach((k) => {
    c[k] = '';
  });
}

//coerce any input into a string
exports.ensureString = (input) => {
  if (typeof input === 'string') {
    return input;
  } else if (typeof input === 'number') {
    return '' + input;
  }
  return '';
};
//coerce any input into a string
exports.ensureObject = (input) => {
  if (typeof input !== 'object') {
    return {};
  }
  if (input === null || input instanceof Array) {
    return {};
  }
  return input;
};

exports.titleCase = (str) => {
  return str.charAt(0).toUpperCase() + str.substr(1);
};

//shallow-clone an object
exports.copy = (o) => {
  let o2 = {};
  o = exports.ensureObject(o);
  Object.keys(o).forEach((k) => {
    o2[k] = o[k];
  });
  return o2;
};
exports.extend = (obj, a) => {
  obj = exports.copy(obj);
  const keys = Object.keys(a);
  for(let i = 0; i < keys.length; i++) {
    obj[keys[i]] = a[keys[i]];
  }
  return obj;
};

//colorization
exports.green = function(str) {
  return c.green + str + c.reset;
};
exports.red = function(str) {
  return c.red + str + c.reset;
};
exports.blue = function(str) {
  return c.blue + str + c.reset;
};
exports.magenta = function(str) {
  return c.magenta + str + c.reset;
};
exports.cyan = function(str) {
  return c.cyan + str + c.reset;
};
exports.yellow = function(str) {
  return c.yellow + str + c.reset;
};
exports.black = function(str) {
  return c.black + str + c.reset;
};
exports.printTag = function(tag) {
  if (tagset[tag]) {
    const color = tagset[tag].color || 'black';
    return exports[color](tag);
  }
  return tag;
};
exports.printTerm = function(t) {
  const tags = Object.keys(t.tags);
  for(let i = 0; i < tags.length; i++) {
    if (tagset[tags[i]]) {
      const color = tagset[tags[i]].color || 'black';
      return exports[color](t.out('text'));
    }
  }
  return c.reset + t.plaintext + c.reset;
};

exports.leftPad = function (str, width, char) {
  char = char || ' ';
  str = str.toString();
  while (str.length < width) {
    str += char;
  }
  return str;
};

exports.isArray = function(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
};

},{"./tagset":48}],3:[function(_dereq_,module,exports){
(function (global){
'use strict';
const buildResult = _dereq_('./result/build');
const pkg = _dereq_('../package.json');
const log = _dereq_('./log');

//the main thing
const ldv = function (str, lexicon) {
  // this.tagset = tagset;
  let r = buildResult(str, lexicon);
  r.tagger();
  return r;
};

//same as main method, except with no POS-tagging.
ldv.tokenize = function(str) {
  return buildResult(str);
};

//this is useful
ldv.version = pkg.version;

//turn-on some debugging
ldv.verbose = function(str) {
  log.enable(str);
};

//and then all-the-exports...
if (typeof self !== 'undefined') {
  self.ldv = ldv; // Web Worker
} else if (typeof window !== 'undefined') {
  window.ldv = ldv; // Browser
} else if (typeof global !== 'undefined') {
  global.ldv = ldv; // NodeJS
}
//don't forget amd!
if (typeof define === 'function' && define.amd) {
  define(ldv);
}
//then for some reason, do this too!
if (typeof module !== 'undefined') {
  module.exports = ldv;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../package.json":1,"./log":5,"./result/build":7}],4:[function(_dereq_,module,exports){
'use strict';
const fns = _dereq_('../fns');

// const colors = {
//   'Person': '#6393b9',
//   'Pronoun': '#81acce',
//   'Noun': 'steelblue',
//   'Verb': 'palevioletred',
//   'Adverb': '#f39c73',
//   'Adjective': '#b3d3c6',
//   'Determiner': '#d3c0b3',
//   'Preposition': '#9794a8',
//   'Conjunction': '#c8c9cf',
//   'Value': 'palegoldenrod',
//   'Expression': '#b3d3c6'
// };

const tag = (t, pos, reason) => {
  let title = t.normal || '[' + t.silent_term + ']';
  title = fns.leftPad('\'' + title + '\'', 12);
  title += '  ->   ' + pos;
  title += fns.leftPad((reason || ''), 15);
  console.log('%c' + title, ' color: #a2c99c');
};
const untag = (t, pos, reason) => {
  let title = t.normal || '[' + t.silent_term + ']';
  title = fns.leftPad('\'' + title + '\'', 12);
  title += '  ~*   ' + pos;
  title += '    ' + (reason || '');
  console.log('%c' + title, ' color: #b66a6a');
};
module.exports = {
  tag: tag,
  untag: untag,
};

},{"../fns":2}],5:[function(_dereq_,module,exports){
'use strict';
const client = _dereq_('./client');
const server = _dereq_('./server');

let enable = false;

module.exports = {
  enable: (str) => {
    if (str === undefined) {
      str = true;
    }
    enable = str;
  },
  tag: (t, pos, reason) => {
    if (enable === true || enable === 'tagger') {
      if (typeof window !== 'undefined') {
        client.tag(t, pos, reason);
      } else {
        server.tag(t, pos, reason);
      }
    }
  },
  unTag: (t, pos, reason) => {
    if (enable === true || enable === 'tagger') {
      if (typeof window !== 'undefined') {
        client.untag(t, pos, reason);
      } else {
        server.untag(t, pos, reason);
      }
    }
  }
};

},{"./client":4,"./server":6}],6:[function(_dereq_,module,exports){
'use strict';
const fns = _dereq_('../fns');

//use weird bash escape things for some colors
const tag = (t, pos, reason) => {
  let title = t.normal || '[' + t.silent_term + ']';
  title = fns.yellow(title);
  title = fns.leftPad('\'' + title + '\'', 20);
  title += '  ->   ' + fns.printTag(pos);
  title = fns.leftPad(title, 54);
  console.log('       ' + title + '(' + fns.cyan(reason || '') + ')');
};

const untag = function(t, pos, reason) {
  let title = '-' + t.normal + '-';
  title = fns.red(title);
  title = fns.leftPad(title, 20);
  title += '  ~*   ' + fns.red(pos);
  title = fns.leftPad(title, 54);
  console.log('       ' + title + '(' + fns.red(reason || '') + ')');
};

module.exports = {
  tag: tag,
  untag: untag,
};

},{"../fns":2}],7:[function(_dereq_,module,exports){
'use strict';
const Text = _dereq_('./index');
const tokenize = _dereq_('./lib/tokenize');
const p = _dereq_('./paths');
const Terms = p.Terms;
const fns = p.fns;
const normalize = _dereq_('../term/methods/normalize').normalize;

//basically really dirty and stupid.
const normalizeLex = function(lex) {
  lex = lex || {};
  return Object.keys(lex).reduce((h, k) => {
    //add natural form
    h[k] = lex[k];
    let normal = normalize(k);
    //remove periods
    //normalize whitesace
    normal = normal.replace(/\s+/, ' ');
    //remove sentence-punctuaion too
    normal = normal.replace(/[.\?\!]/g, '');
    if (k !== normal) {
      //add it too
      h[normal] = lex[k];
    }
    return h;
  }, {});
};

const fromString = (str, lexicon) => {
  let sentences = [];
  //allow pre-tokenized input
  if (fns.isArray(str)) {
    sentences = str;
  } else {
    str = fns.ensureString(str);
    sentences = tokenize(str);
  }
  //make sure lexicon obeys standards
  lexicon = normalizeLex(lexicon);
  let list = sentences.map((s) => Terms.fromString(s, lexicon));

  let r = new Text(list, lexicon);
  //give each ts a ref to the result
  r.list.forEach((ts) => {
    ts.refText = r;
  });
  return r;
};
module.exports = fromString;

},{"../term/methods/normalize":52,"./index":9,"./lib/tokenize":11,"./paths":18}],8:[function(_dereq_,module,exports){
module.exports = {
  /** did it find anything? */
  found: function() {
    return this.list.length > 0;
  },
  /** just a handy wrap*/
  parent: function() {
    return this.reference || this;
  },
  /** how many Texts are there?*/
  length: function() {
    return this.list.length;
  },
  /** nicer than constructor.call.name or whatever*/
  isA: function() {
    return 'Text';
  },
  /** the whitespace before and after this match*/
  whitespace: function() {
    return {
      before: (str) => {
        this.list.forEach((ts) => {
          ts.whitespace.before(str);
        });
        return this;
      },
      after: (str) => {
        this.list.forEach((ts) => {
          ts.whitespace.after(str);
        });
        return this;
      }
    };
  }

};

},{}],9:[function(_dereq_,module,exports){
'use strict';
//a Text is an array of termLists
const getters = _dereq_('./getters');

function Text(arr, lexicon, reference) {
  this.list = arr || [];
  this.lexicon = lexicon;
  this.reference = reference;
  //apply getters
  let keys = Object.keys(getters);
  for(let i = 0; i < keys.length; i++) {
    Object.defineProperty(this, keys[i], {
      get: getters[keys[i]]
    });
  }
}
_dereq_('./methods/loops')(Text);
_dereq_('./methods/out')(Text);
_dereq_('./methods/misc')(Text);

module.exports = Text;

},{"./getters":8,"./methods/loops":12,"./methods/misc":13,"./methods/out":14}],10:[function(_dereq_,module,exports){
//these are common word shortenings used in the lexicon and sentence segmentation methods
//there are all nouns,or at the least, belong beside one.
'use strict';

//common abbreviations
let compact = {
  Noun: [
    'arc',
    'al',
    'exp',
    'fy',
    'pd',
    'pl',
    'plz',
    'tce',
    'bl',
    'ma',
    'ba',
    'lit',
    'ex',
    'eg',
    'ie',
    'ca',
    'cca',
    'vs',
    'etc',
    'esp',
    'ft',
    //these are too ambiguous
    'bc',
    'ad',
    'md',
    'corp',
    'col'
  ],
  Organization: [
    'dept',
    'univ',
    'assn',
    'bros',
    'inc',
    'ltd',
    'co',
    //proper nouns with exclamation marks
    'yahoo',
    'joomla',
    'jeopardy'
  ],

  Place: [
    'Str',
    'rd',
    'st',
    'dist',
    'mt',
    'ave',
    'blvd',
    'cl',
    'ct',
    'cres',
    'hwy',
    //states
    'ariz',
    'cal',
    'calif',
    'colo',
    'conn',
    'fla',
    'fl',
    'ga',
    'ida',
    'ia',
    'kan',
    'kans',

    'minn',
    'neb',
    'nebr',
    'okla',
    'penna',
    'penn',
    'pa',
    'dak',
    'tenn',
    'tex',
    'ut',
    'vt',
    'va',
    'wis',
    'wisc',
    'wy',
    'wyo',
    'usafa',
    'alta',
    'ont',
    'que',
    'sask'
  ],

  Date: [
    'jan',
    'feb',
    'mar',
    'apr',
    'jun',
    'jul',
    'aug',
    'sep',
    'sept',
    'oct',
    'nov',
    'dec',
    'circa'
  ],

  //Honorifics
  Honorific: [
    'adj',
    'adm',
    'adv',
    'asst',
    'atty',
    'bldg',
    'brig',
    'capt',
    'cmdr',
    'comdr',
    'cpl',
    'det',
    'dr',
    'esq',
    'gen',
    'gov',
    'hon',
    'jr',
    'llb',
    'lt',
    'maj',
    'messrs',
    'mister',
    'mlle',
    'mme',
    'mr',
    'mrs',
    'ms',
    'mstr',
    'op',
    'ord',
    'phd',
    'prof',
    'pvt',
    'rep',
    'reps',
    'res',
    'rev',
    'sen',
    'sens',
    'sfc',
    'sgt',
    'sir',
    'sr',
    'supt',
    'surg'
  //miss
  //misses
  ]

};

//unpack the compact terms into the misc lexicon..
let abbreviations = {};
const keys = Object.keys(compact);
for (let i = 0; i < keys.length; i++) {
  const arr = compact[keys[i]];
  for (let i2 = 0; i2 < arr.length; i2++) {
    abbreviations[arr[i2]] = keys[i];
  }
}
module.exports = abbreviations;

},{}],11:[function(_dereq_,module,exports){
//(Rule-based sentence boundary segmentation) - chop given text into its proper sentences.
// Ignore periods/questions/exclamations used in acronyms/abbreviations/numbers, etc.
// @spencermountain 2017 MIT
'use strict';
const abbreviations = Object.keys(_dereq_('./abbreviations'));
//regs-
const abbrev_reg = new RegExp('\\b(' + abbreviations.join('|') + ')[.!?] ?$', 'i');
const acronym_reg = new RegExp('[ |\.][A-Z]\.?( *)?$', 'i');
const elipses_reg = new RegExp('\\.\\.+( +)?$');

//start with a regex:
const naiive_split = function (text) {
  let all = [];
  //first, split by newline
  let lines = text.split(/(\n+)/);
  for(let i = 0; i < lines.length; i++) {
    //split by period, question-mark, and exclamation-mark
    let arr = lines[i].split(/(\S.+?[.!?])(?=\s+|$)/g);
    for(let o = 0; o < arr.length; o++) {
      all.push(arr[o]);
    }
  }
  return all;
};

const sentence_parser = function (text) {
  text = text || '';
  text = '' + text;
  let sentences = [];
  //first do a greedy-split..
  let chunks = [];
  //ensure it 'smells like' a sentence
  if (!text || typeof text !== 'string' || /\S/.test(text) === false) {
    return sentences;
  }
  //start somewhere:
  let splits = naiive_split(text);
  //filter-out the grap ones
  for (let i = 0; i < splits.length; i++) {
    let s = splits[i];
    if (s === undefined || s === '') {
      continue;
    }
    //this is meaningful whitespace
    if (/\S/.test(s) === false) {
      //add it to the last one
      if (chunks[chunks.length - 1]) {
        chunks[chunks.length - 1] += s;
        continue;
      } else if (splits[i + 1]) { //add it to the next one
        splits[i + 1] = s + splits[i + 1];
        continue;
      }
    }
    //else, only whitespace, no terms, no sentence
    chunks.push(s);
  }

  //detection of non-sentence chunks:
  //loop through these chunks, and join the non-sentence chunks back together..
  for (let i = 0; i < chunks.length; i++) {
    let c = chunks[i];
    //should this chunk be combined with the next one?
    if (chunks[i + 1] !== undefined && (abbrev_reg.test(c) || acronym_reg.test(c) || elipses_reg.test(c))) {
      chunks[i + 1] = c + (chunks[i + 1] || '');
    } else if (c && c.length > 0) { //this chunk is a proper sentence..
      sentences.push(c);
      chunks[i] = '';
    }
  }
  //if we never got a sentence, return the given text
  if (sentences.length === 0) {
    return [text];
  }
  return sentences;
};

module.exports = sentence_parser;
// console.log(sentence_parser('john f. kennedy'));

},{"./abbreviations":10}],12:[function(_dereq_,module,exports){
'use strict';
//this methods are simply loops around each termList object.
const methods = [
  'toTitleCase',
  'toUpperCase',
  'toLowerCase',
  // 'toCamelCase',
  //
  // 'hyphenate',
  // 'dehyphenate',
  // 'trim',
  //
  // 'insertBefore',
  // 'insertAfter',
  // 'insertAt',
  //
  // 'replace',
  // 'replaceWith',
  //
  // 'delete',
  // 'lump',

  'tagger',

// 'tag',
// 'unTag',
];

const addMethods = (Text) => {
  methods.forEach((k) => {
    Text.prototype[k] = function () {
      for(let i = 0; i < this.list.length; i++) {
        this.list[i][k].apply(this.list[i], arguments);
      }
      return this;
    };
  });

  //add an extra optimisation for tag method
  Text.prototype.tag = function() {
    //fail-fast optimisation
    if (this.list.length === 0) {
      return this;
    }
    for(let i = 0; i < this.list.length; i++) {
      this.list[i].tag.apply(this.list[i], arguments);
    }
    return this;
  };
};

module.exports = addMethods;

},{}],13:[function(_dereq_,module,exports){
'use strict';
const Terms = _dereq_('../paths').Terms;


const miscMethods = (Text) => {

  const methods = {

    terms: function() {
      let list = [];
      //make a Terms Object for every Term
      this.list.forEach((ts) => {
        ts.terms.forEach((t) => {
          list.push(new Terms([t], ts.lexicon, this));
        });
      });
      let r = new Text(list, this.lexicon, this.parent);
      return r;
    },

  };

  //hook them into result.proto
  Object.keys(methods).forEach((k) => {
    Text.prototype[k] = methods[k];
  });
  return Text;
};

module.exports = miscMethods;

},{"../paths":18}],14:[function(_dereq_,module,exports){
'use strict';
const topk = _dereq_('./topk');
const offset = _dereq_('./offset');
const termIndex = _dereq_('./indexes');

const methods = {
  text: (r) => {
    return r.list.reduce((str, ts) => {
      str += ts.out('text');
      return str;
    }, '');
  },
  normal: (r) => {
    return r.list.map((ts) => {
      let str = ts.out('normal');
      let last = ts.last();
      if (last) {
        let punct = last.endPunctuation();
        if (punct === '.' || punct === '!' || punct === '?') {
          str += punct;
        }
      }
      return str;
    }).join(' ');
  },
  root: (r) => {
    return r.list.map((ts) => {
      return ts.out('root');
    }).join(' ');
  },
  /** output where in the original output string they are*/
  offsets: (r) => {
    return offset(r);
  },
  /** output the tokenized location of this match*/
  index: (r) => {
    return termIndex(r);
  },
  grid: (r) => {
    return r.list.reduce((str, ts) => {
      str += ts.out('grid');
      return str;
    }, '');
  },
  color: (r) => {
    return r.list.reduce((str, ts) => {
      str += ts.out('color');
      return str;
    }, '');
  },
  array: (r) => {
    return r.list.map((ts) => {
      return ts.out('normal');
    });
  },
  csv: (r) => {
    return r.list.map((ts) => {
      return ts.out('csv');
    }).join('\n');
  },
  newlines: (r) => {
    return r.list.map((ts) => {
      return ts.out('newlines');
    }).join('\n');
  },
  json: (r) => {
    return r.list.reduce((arr, ts) => {
      let terms = ts.terms.map((t) => {
        return {
          text: t.text,
          normal: t.normal,
          tags: t.tag
        };
      });
      arr.push(terms);
      return arr;
    }, []);
  },
  html: (r) => {
    let html = r.list.reduce((str, ts) => {
      let sentence = ts.terms.reduce((sen, t) => {
        sen += '\n    ' + t.out('html');
        return sen;
      }, '');
      return str += '\n  <span class="nl-Satz">' + sentence + '\n  </span>';
    }, '');
    return '<span> ' + html + '\n</span>';
  },
  terms: (r) => {
    let arr = [];
    r.list.forEach((ts) => {
      ts.terms.forEach((t) => {
        arr.push({
          text: t.text,
          normal: t.normal,
          tags: Object.keys(t.tags)
        });
      });
    });
    return arr;
  },
  debug: (r) => {
    console.log('====');
    r.list.forEach((ts) => {
      console.log('   --');
      ts.debug();
    });
    return r;
  },
  topk: (r) => {
    return topk(r);
  }
};
methods.plaintext = methods.text;
methods.normalized = methods.normal;
methods.colors = methods.color;
methods.tags = methods.terms;
methods.offset = methods.offsets;
methods.idexes = methods.index;
methods.frequency = methods.topk;
methods.freq = methods.topk;
methods.arr = methods.array;

const addMethods = (Text) => {
  Text.prototype.out = function(fn) {
    if (methods[fn]) {
      return methods[fn](this);
    }
    return methods.text(this);
  };
  Text.prototype.debug = function() {
    return methods.debug(this);
  };
  return Text;
};


module.exports = addMethods;

},{"./indexes":15,"./offset":16,"./topk":17}],15:[function(_dereq_,module,exports){
'use strict';
//find where in the original text this match is found, by term-counts
const termIndex = (r) => {
  let result = [];
  //find the ones we want
  let want = {};
  r.terms().list.forEach((ts) => {
    want[ts.terms[0].uid] = true;
  });

  //find their counts
  let sum = 0;
  let parent = r.all();
  parent.list.forEach((ts, s) => {
    ts.terms.forEach((t, i) => {
      if (want[t.uid] !== undefined) {
        result.push({
          text: t.text,
          normal: t.normal,
          term: sum,
          sentence: s,
          sentenceTerm: i
        });
      }
      sum += 1;
    });
  });

  return result;
};
module.exports = termIndex;

},{}],16:[function(_dereq_,module,exports){
'use strict';
/** say where in the original output string they are found*/

const findOffset = (parent, term) => {
  let sum = 0;
  for(let i = 0; i < parent.list.length; i++) {
    for(let o = 0; o < parent.list[i].terms.length; o++) {
      let t = parent.list[i].terms[o];
      if (t.uid === term.uid) {
        return sum;
      } else {
        sum += t.whitespace.before.length + t._text.length + t.whitespace.after.length;
      }
    }
  }
  return null;
};

//like 'text' for the middle, and 'normal' for the start+ends
//used for highlighting the actual words, without whitespace+punctuation
const trimEnds = function(ts) {
  let terms = ts.terms;
  if (terms.length <= 2) {
    return ts.out('normal');
  }
  //the start
  let str = terms[0].normal;
  //the middle
  for(let i = 1; i < terms.length - 1; i++) {
    let t = terms[i];
    str += t.whitespace.before + t.text + t.whitespace.after;
  }
  //the end
  str += ' ' + terms[ts.terms.length - 1].normal;
  return str;
};

//map over all-dem-results
const allOffset = (r) => {
  let parent = r.all();
  return r.list.map((ts) => {
    let words = [];
    for(let i = 0; i < ts.terms.length; i++) {
      words.push(ts.terms[i].normal);
    }
    let nrml = trimEnds(ts);
    let txt = ts.out('text');
    let startAt = findOffset(parent, ts.terms[0]);
    let beforeWord = ts.terms[0].whitespace.before;
    let wordStart = startAt + beforeWord.length;
    return {
      text: txt,
      normal: ts.out('normal'),
      //where we begin
      offset: startAt,
      length: txt.length,
      wordStart: wordStart,
      wordEnd: wordStart + nrml.length,
    // wordLength: words.join(' ').length
    };
  });
};
module.exports = allOffset;

},{}],17:[function(_dereq_,module,exports){
'use strict';
//
const topk = function (r, n) {
  //count occurance
  let count = {};
  r.list.forEach((ts) => {
    let str = ts.out('root');
    count[str] = count[str] || 0;
    count[str] += 1;
  });
  //turn into an array
  let all = [];
  Object.keys(count).forEach((k) => {
    all.push({
      normal: k,
      count: count[k],
    });
  });
  //add percentage
  all.forEach((o) => {
    o.percent = parseFloat(((o.count / r.list.length) * 100).toFixed(2));
  });
  //sort by freq
  all = all.sort((a, b) => {
    if (a.count > b.count) {
      return -1;
    }
    return 1;
  });
  if (n) {
    all = all.splice(0, n);
  }
  return all;
};

module.exports = topk;

},{}],18:[function(_dereq_,module,exports){
module.exports = {
  fns: _dereq_('../fns'),
  Terms: _dereq_('../terms'),
  tags: _dereq_('../tagset'),
};

},{"../fns":2,"../tagset":48,"../terms":67}],19:[function(_dereq_,module,exports){
'use strict';

//thanks germany!
const capitalStep = (ts) => {
  const reason = 'titlecase-noun';
  ts.terms.forEach((t, i) => {
    if (i === 0) {
      return;
    }
    //is titleCase?
    if (/^[A-Z][a-z-]+$/.test(t.text) === true) {
      t.tag('Substantiv', reason);
    }
  });
  return ts;
};
module.exports = capitalStep;

},{}],20:[function(_dereq_,module,exports){
'use strict';
const suffixTest = _dereq_('./lib/suffixTest');

const patterns = {
  femaleNouns: [_dereq_('./patterns/femaleNouns'), 'FemininSubst'],
  maleNouns: [_dereq_('./patterns/maleNouns'), 'MannlichSubst'],
  neuterNouns: [_dereq_('./patterns/neuterNouns'), 'SachlichSubst'],
};

//
const genderStep = (ts) => {
  const reason = 'suffix-match';
  const keys = Object.keys(patterns);
  ts.terms.forEach((t) => {
    //only try nouns
    if (t.tags.Substantiv !== true) {
      return;
    }
    for(let i = 0; i < keys.length; i++) {
      if (suffixTest(t, patterns[keys[i]][0]) === true) {
        t.tag(patterns[keys[i]][1], reason);
        return;
      }
    }
  });
  return ts;
};
module.exports = genderStep;

},{"./lib/suffixTest":39,"./patterns/femaleNouns":42,"./patterns/maleNouns":43,"./patterns/neuterNouns":44}],21:[function(_dereq_,module,exports){
'use strict';
const capitalStep = _dereq_('./capital-step');
const lexStep = _dereq_('./lexicon-step');
const suffixStep = _dereq_('./suffix-step');
const nounFallback = _dereq_('./noun-fallback');
const genderStep = _dereq_('./gender-step');
//
const tagger = (ts) => {
  // look against known-words
  ts = lexStep(ts);
  // look at titlecase terms
  ts = capitalStep(ts);
  // look at known-suffixes
  ts = suffixStep(ts);
  // assume nouns, otherwise
  ts = nounFallback(ts);
  // guess gender for nouns, adjectives
  ts = genderStep(ts);
  return ts;
};
module.exports = tagger;

},{"./capital-step":19,"./gender-step":20,"./lexicon-step":22,"./noun-fallback":40,"./suffix-step":47}],22:[function(_dereq_,module,exports){
'use strict';
const lex = _dereq_('./lexicon');

const lexStep = (ts) => {
  const reason = 'lexicon-match';
  const keys = Object.keys(lex);
  //each term
  for(let i = 0; i < ts.terms.length; i++) {
    let t = ts.terms[i];
    //each lexicon:
    for(let o = 0; o < keys.length; o++) {
      let k = keys[o];
      if (lex[k].obj[t.normal] !== undefined) {
        t.tag(lex[k].tag, reason);
        break;
      }
    }
  }
  return ts;
};
module.exports = lexStep;

},{"./lexicon":38}],23:[function(_dereq_,module,exports){
module.exports="0:ER;1:EN;2:EH;3:D5;4:AX;5:C7;6:EJ;7:E9;8:D3;9:DU;A:DQ;B:DO;C:C4;D:CF;E:EO;aD0bB4chinB3dAAe8Uf8Dg6Ph6Ci5Xj5Qk54l4Rm4An3Yo3Pp35q6Hr2Rs1Wt1Ou0Ov01wPzF;aMeLuIwF;anzBLeiF;felBAtF;eAgE8hoec2Wstaerks0wi4M;egel9HfriedEEgespitBTkunftsGlassungsbeschraenk0nehmDJrueckgekeBNsF;aetz48ta3V;geri19o62;hn0itgemaess2nM;gB4hlF;lo5reiDT;aPeIiFoch1PuenschC1;chtigGederho9Nld,rFssens-weDB;k7tschaft41;!e60s7E;iIltHrt,sGttbewerbsneuF;tr4;e7Kt73;beruehmt2gDUweit7D;s5tF;!eFgehD4verbr9L;!rAW;chs1Jhrschein7sserd16;eKiertJoF;ell6rF;auss34geFigDUteilAOzugs1V;lD6sF;ehNt5U;!e,gDK;heme9rF;aRbQdPeiMfLgJhaeB1kIleEmHoeffentli8ruecDZsFtraut,wirCTzweif9R;chFeu8iegCYpaet7FtaerDY;achtCXiedeneAulCG;arkCCehCQ;la1oC7rusCBuerz0;angFeb7olCD;enDJ;em0olg0rueBA;nFs0;bB6fa8igFz9I;te,ungAQ;aDVr87;e76l6Yre6G;eGntwortF;e0liDGungsbewuD5;nd1rgeBH;eb0Am07nGrF;al0sprueng7;angebracAZbeWeRgeOhinterfraC2interesCOkMmittel9Kp0AsLterJvFzeit84;erGoF;ll6QrbereitD;aeZfaelscAWletAJmiZsF;orBYtel8J;g06sF;chied22t53;er39ozi4;lFontro98;ar,ug;aDHeignDfaehrdDh8BklaeC1loe7XnutACrechtferAHsGte5QwF;i7UoDG;chminB9t89;ingeschraenB8rF;h87kan9lHwF;aFu7D;eh9rt6I;aubt,edC4;aMeindrucB3fristDgrLhJirBTkanCrIsGwFzaBB;affnDus7O;chFetA2tiD4;adDw1;ecA8uehAS;elliBFiF;ndeBN;en9XueAR;chtD;fangreic0XgeGkaemAGstritten5SweltFzaeun0;gBCo45;kehBIrechnD;erFr8W;a7Gfül7SgGhoe82pFrasAWschuldDteueBGwiegBHzeugAP;roport8B;eoBL;aLeKiefJoHrFuerkB;aditionFis0uebs0;eC6s74;erFt;ic9X;!e4Iro0s0;chn3ur91;buiC8et6ge3Ftsaech7ube;a08chZeXiVoSpQtGueF;ffiBHss2;aMeKillg68rHuF;fIndF;en3A;eFiC6uktu3L;ckFng;enV;i7OllvertretF;ende;atliBBeFndfe6Rrk53tio83;nd6rk2A;aFezialiBVitz,o1J;et41n3;genann4WzialF;!dem80eFversicherungs75;n,r;chFnn6NtuationsbedinAF;e0Xt7W;cZlbstFns5NpaBJ;bewus8OgenuE;aMief,lLmKnellJoIrittHuld6wF;erFier3K;en,s0wieg9R;wei5;ens0n6E;!er;a83erz7S;au,echt95ic6Z;erfs0rf2;ch58n9At0;aQeIiHoGuF;ecksichts68nderneu1ssB;bus0te;cht6skaC;al,cht1DgKiIlHnGpublikan3siF;gnA4ste9;om2St2H;aVevAMig18;b60cFn;hs0;elrec6MiFu5E;er0on4;dikal8Retselh19ffi76sFt6U;aCch;aUerSlRoMrFublik;aIeisHivat2oF;fit27mF;inente8Mpt;bereini9Jwe8V;eGktiF;sARzi1;se9zi5;lHsF;iFthum;tiv;itischFn3;!e64;aus4Ko2Q;fe8SmaneCsoenF;lichA5;laestinens3rGtriarFusF;ch4;allA7teiF;inPlo5;bLeJffGpt0CrF;dnu53ganiADi6A;enFiziell9Y;en,sF;icht7;ffentYkoFsterreich3;logBnomB;eFsolD;rs0;aOeKiIoGuechF;tern;et6min4rm4twF;endig9O;edFgeri9D;erlaend3r6D;nn7Mt0uF;!eFgegru3Dn0;!n,r,sF;!te;c9Zechs2Yh9Hmh04s5tF;ionale,ur4L;aQeNiLoFysterW;derIegHmeGnF;a0Xti1;ntM;lich2V;at2nF;!en,s0;litaFnK;erBn0;diFhrfa9Jil1N;al,en3EterrF;an;eIngel5TrkHssGxF;im4;enhOiv91;an0i1;cht6B;aMeIiGondon64uxurF;ioe5;ber4nkF;e,sgeri7S;bGg4iFtz0;c4Rse;ens0DhF;af0;engInGteCuF;f31nen5R;d5KgF;!em,frist6sam;er,s0;aYiXlVnappe,oIrGuF;enftig24r19;aeft6iFo56;sengeschuett80t3;loss4mNnHrrGstenF;guenst5Slo5;e8Xu90;grue9kr2DsItroHzeF;nt0ArF;n0Ut87;l31vers;equeColi2EtF;a9ern7K;fortXmHpF;eteClFromis1E;et0iz4O;e3Munist3;are,einFug;!e06kar7Es0;lometer0Knd37;lt2tF;astroph4hol3;aHuF;eFng2;d3ngs1E;ehr7hrFp7M;eGzehnF;teF;lang;lleg4mp2DnIrreGsFtalien3;lamBol49raelB;leva9parF;ab7U;dire86fNhaf4WnovationsoMsze48tF;a85eFrovert6Y;gJlligeCrF;essHnF;!ationalF;!eM;aCie5X;ri1;ri3R;i3SorF;mi1;aOeLiKoF;chHeGheF;!n,r;ch4Pher0U;entw2OqF;ualifi3L;es3Ylf2Istor3;ft6i2CrFss3;be,gestF;ell0;eufGlbeAndf7ErF;m2Dt2;ig56;aran48eTlRnadQrFut2;aNenzPoJuF;ndsaHppF;enF;we1K;etz7;be,essHssF;!eF;!r;er2teA;ndFu;io5;en1Z;aFeichzeit6obal07;t0ub3O;ae0Lb0Jeign0Kf0Fg0Dk0Cl08m03n00pZrXsOtKu62wGzF;a5Ee66i2U;aGiFo7Buens8;l26s5;ehFltberei0;l0r0;aHeGrF;e61o1M;il0;rn0uf0;amSchLellschaftKiJpHtFu8;ar58eF;ll0u1;anCraechF;sbere0V;ch1nn0;li5E;aeEeFi6Xmugg5Mwae8;it1;ec20iF;ch4Zng46;anz1fl5LlanHra5L;aFehm5LuE;nnFu;teA;aHeinFis8;!samFte;!eA;ch0essF;!i3L;au9be,eFob0;geGiFnk0;s4Nte0;nt7;auf0lei4Onue3V;enwaert6laub0ruF;en4M;aHeiGord1ueF;hr0ll0;er0t;els8ss0;au0eut4YildFra8;et2;nd1uF;ss1;aUckw-13eRiQlexPoMrIuF;eGnF;di1;hre0Qnf0;anzo20eieAistHuF;cht0IeheF;n,reA;gerec35;lgGrF;ci1m4tgeseE;end5A;ib56;nanzie57t,xi1;hl1Oin,stFt0u8;e,gF;el4I;ls59rb07t4vori5A;c0Tffizient2Zh0Si0Iklat4Qle42m0Gn08rMtabLuHvangel3xF;a3GpFterritori4zel4Q;lizH;-1PropaF;eischGweF;it;eAs0;li1;aZbUfPhNkenn18leicht1nLsIwFzeug0;artGuF;ensc0J;e0uO;atzUe5BtF;au9eF;!ll0s;e4ZstF;e,ha2Q;eblich2oF;eh0;ahruGoF;lgreich2Grder7;ngsF;gemaeF;ss;aGit2LoF;st;rmFu0;ungsF;lo5;rbW;dLgKtF;fIsGtaeus8wF;ick3H;cheid3Bet1LprecheF;ndeA;erCue1D;!ag0D;guelt6lo5;anzipi1ot01pF;oe34;geneNnGskaFt3W;lt;deut6geHig,stig,wandGzF;eln,ig0U;freie;b2HfueHlGrFseE;eis0i2I;ei2I;g0hr0;!n,r,s;emal0Sren1J;ht2;a03eUiRoOrJuF;enn,mpHnk3JrchF;geFschnitt7;fue0TseE;fe;astis3NeiHiF;ng2MttF;e,g39;dimensFst2ze3Z;ion4;kumGmiPppFti1;elt2;en0B;cGenstaelt3DfferenFre3Kskre0ver5;zi1;ht,ke;fek0mLnkKsItaiGut7zentF;!r4;llF;ie1B;igForient26;ni1;bar;okrF;atB;en1EmalHuF;erF;ha0Z;ig2V;esB;a18eYiVlUoQrJuF;ergernah,nF;dFt2;esF;weit2;aungebra23eitKiJuF;chstueGesk1Qt4;al;ckF;haft;lla9sa9tB;!e,geschi17;dengestueEeGnnFsnB;er;rsennoFse;ti1;os5utueberstroU;llGsherF;igeA;igs0;absicht1Nd0Kfr0Hg0Dherrs8ispiel0Aka07l04m00nXrRsMtJvorzu14wFziff1;aGirtschaf0YusF;st2;eFff1I;hr0;ag0riebF;sbediF;ng0;chHeEor0Wser2tF;e,i2HuerF;zt;aFlagnahm0;emt;eIueF;chFhmtR;tiF;gt2;cFit;hti0M;achFuE;bFteil13;ar0;erkGueF;ht;ensF;weR;eidi0EiebtF;!eF;!s0;emGnC;nt2;pf0;haGlo5;se;ft2;eFrenz0;hr0isF;teF;rt2;euFisW;ndD;et;eFinYroh0;cGutF;ends0;kt;rocke,yerF;ische;b14ch0dres13e0Zk0Sl0Nm0DnZrTuFvi13;fgeQsF;drueck7geGlaendBreiF;chZ;bLdKlo0Wma8pra06rHschuGwaeFzeich05;hl0;etH;iFuesG;chF;te0;e17ien0;au0ilF;de0;bra8reFstau0;gt;ab3roHtgF;ere8;ch0;ga9;isF;ch0D;alog,erkaRgeIschliessHtiquF;ieF;rt;end;b7kuendMlLoJrLsF;iedHpaMtF;a0NrF;eb0;el0;rdF;ne0;eg0;ig0;nn0;bKerikGueF;sa9;anB;isF;cheA;!n;ivaGulF;an0;le9;nt;lFt2;ergGgemeinF;!en;roeF;ss0;kuKtHut,zeptF;abFi1;el;iv,ueF;llF;en;rat;hn7ltF;es0;liF;ch;si1;geMhaeng6ruKsF;olHtrF;aFus;kt2;ut2;!e;pt;ig;druKleJsF;eEich1tiF;mm0;er0;tz0;hn0;ck0;te"
},{}],24:[function(_dereq_,module,exports){
module.exports="0:AH;1:AB;2:AN;3:AQ;4:9S;5:AR;6:9X;7:AW;8:8Y;9:AL;A:9O;B:AF;C:5G;D:6H;E:AI;a9Ib8Jc8Id7Re72f6Og5Xh5Ai4Tj4Lk4Fl43m3Mn30o2Up2Rqu2Pr2Is1It1Bu0Wv0Ew01x-m2zFà;eYiXuNwF;aKeHischenF;!dF;r6ur5;c5CiF;hunderAUm2teF;m2n7T;nFr;g9Jzigm2;allerAOeNgLleKmJnIobAOsHtGvor,weFzuAT;ge,il0;aAAief9;chuld0eh73;ae93ich8Sutze;ei9indest3Zu8R;i99t48;egebene8Ll1Erun98uF;n9Ite;i4r9;em3rka;h1OitF;le09wA;aOeKiIoF;a8Achen7Hert3hlGmoAFrF;tgenau0Zu33;!an,gemerkt;d1ederF;!um;ch,g0iFni0Rrk7Cst67;la9AtF;aFer9Fh6;b,us;ehrendde86hFnderbare8;lwArF;ha9Mli5;erSiOoF;lleMnLrF;!ab,b4Pd6Ker9gest58hJmInGsich0Xu5HwF;a8Seg;!eFhe1V;!w9J;a7ittag;er,in;!ei4noet0sta3W;n68r;a,eF;lGrF;m2t6N;e2Pfa5leicht,me97;botene8gGmut3sFtrack3K;taend7Vus;eFleich8C;beD;!ebPltimo,mNnFsw;bedingt,eiDgJisono,lae49noet54teHverFwe94;diente7IsF;chaem3DeheD;n,rF;!de7Gei4h83schiedsl89weB;eFlu4F;a6Jme6rF;ech38n;!ei4soF;!n9;erFli7Iri1V;!aGd12ei4ga0MhaFmorg0rasch71;nd,upt;ll,us;aIeGoFrotz,schingderassab8Fyp27;i,nnC;ilFstwA;s,wA;eg3gFus5S;ewAsF;!u4G;am0Dch06eWiSoLpJtF;aHeGrenFundC;gs4O;llCts;dtein4SngCpelwA;aetFri5;es4K;!da2Leb0fo61gJlcherIm8CnGwFzusag0;en5Eieso;derg5WnFst;ab52taB;a5Xma6O;ar,lF;ei5;cherGeFnn6R;beQhs6N;heiFli5;tshalb1;chsmMhLiHlF;bFt0;er,st;neGtF;!eDh1wa75;rFtw2S;s8Eze7V;n6Nr;al,illioneF;nm2;aJeibchClGnFon;ells3Xurstrac2K;ankw7QeGiF;chtw7Pe74;c19un3L;etzuFria68;ng6Q;s52t;a5BeIings78uF;eck3VnF;dFt1;!h4Qum,w7H;aliGchtFihCtour;eDs;st0Ut1;aFer;rtal6Gsi;arGer,hasClausibSroFunk57;!bewAzentu2;!adoxe8to31;beHeft1ftUhneFnline;!dFg4Sh6;ies;nFrh67;!a2MdF;re6;!aTePiLoHuF;nFr;!me6W;chHrmaGtF;fEwend2X;le8;!m3H;eHmm1rgendF;sFwo;!wo;!ma7;bGt4NuF;erd6Uli5;enFst;!an,b1Rei4h1;chIeHheGm3HtuerlichF;!e8;!b1Ozu;chs2Qm3;!ei4hGmFts;a7it3Z;er,ine6;aReOiIoF;eglichGn3WrF;geD;e8st;nde2HtF;!ei4h6nicht0s6EtGuF;nt1;ag6WeFlerwei5Kwochs;ls,nF;!dr6;hr6RiF;neFstV;rs6Mtw0Z;l,nFssC;chFge7;eFm2;ror6J;aLeHiGogF;is4L;eb1n0Qte8;dig3iGtztF;end3li5ma7;cFd1;hth6;engsHnGutF;!ha7;da42ge;s67tF;!eD;a5BeinesJnapp,onIuF;erz3rF;iose8zF;erha50um;sequenTt1Z;fEweB;aLeGuF;e0Kst;!dGh1ma7ns5XtFw0S;zt;eFo5;nfErFsm2;a2Zze5A;!mmerscha4B;hre4ZmSnIrgendF;!wF;aFie,o;nn;!bNcl,desMei4fol53klusive,mKneJsGteressanFzwis2R;te8;bLgeGoF;f0Owe51;h2Us54;n,rh42;iFm1;tt0;!s0;esondere;meFst3V;ns,rF;!h6zu;aXeQiHoF;echstFffent3;eDpersön3;eLnF;a06e6fo2CgJsicht3teFu0J;nHrF;!ei4h1ruecF;ks;!ra2B;eg0;!rF;!bKin,zul3H;idenaKrHuF;er,tF;e,zuta4C;!a2PbGuF;eb1nt1;ei;ng9;lGufC;enwA;bFt;e-hal2PtaBweB;a03eOlJottlob,rF;atis,oF;esstFssF;entF;ei7;eichGuF;eck2L;!aGerFfEma2Do3Vwohl;ma2CwA;uf;faellSgeOmeinh6nKrIsGwissF;!e28;chwei3RtF;ern;adeFechterNn40;!a1Hm2so,weBzu;auFug;esUsoF;!gFw0O;ut;benHnF;!ei4uF;eb1;enfE;ig9;engFnz,r;ige8;aRern1luPoNrIueF;nfGrF;!ei4wa38;m2teDundzwanz0D;eiIueheF;r,sF;teD;ns;hera0Xli5taB;lgFrtan;ende1Ili5;gs,ssabF;wa29;elsch1Nst;benZg2hWiOnMrItHxF;cellence,tF;ra;c,wa;freu1Igo,sF;a28tF;!aun1Gen06mF;al3G;d3tF;l0Vspreche27;gKlInF;e2Ffa5g26ige13m2sF;c1RtF;!ma7w0Q;enF;ds;enF;s,t3;!eFr14;dFma7r;em;!fEsoF;!wF;enF;ig;a00eTieQoPrIuF;cha01rchGtzF;endm2;!aZei4weg2V;au0Meim2iHob0uF;eb0mhFnt0;er1T;nHttF;enF;m2s;!n0;nnersHrt1M;nsGsF;m2s2G;taB;mnae0Pnno5rJsF;gGsenungeaFto;cht0Z;leiF;ch0;aFein9gestalt,ma06weil,ze1Q;rt;hIma7nHrF;nied1ueberhinaF;us;k,n;eim;a,irca;a08eOiHlGrutF;to;indl1Lo07;nn0sIttF;eFsG;!sF;cho0;!h1lGwF;eil0;ang;dauerVfehlsUgreifViPkanntMrKsHzF;eichnFu1N;ende8;oGtenF;fEs;nders;ei1MgaF;b,uf;eFli5;rmaF;ss0;!dIei4leiHnahe,sF;eiFpiel01;te;be;e0Ks1C;gemaeJ;liF;che8;rwA;ldGn0NrfuF;ss;!moegF;liF;ch9;b0Ych0Weuss0Ul0Bmtliche0AnTpropSuF;ch,fPsF;gerechnNnahmMsFweis3;cKeF;n,rF;!hHstF;anF;de;alb;hlieQ;swA;et;!ei4gruOwaF;er0Q;os;!dOei4fMgesich0OhaLlaeKsF;aHonGtelF;le;st0;tzwA;eise;ss3;nd;anB;nand1;erFie;eKnJsF;!rHwoF;!h6;in;um;fEor08taB;rs06;ias,lGsFtersh1;bald,o;eNhi1s03wLzF;eJuF;lanHoGseF;hr;ft;ge;it;eg;er;inLm2nIrdGsF;amt;inB;gs;fEthalb0;en;al7;!e;er9;st;tm2;al;eKsIzuF;eg3;li5;ch;eiF;ts;ndHrF;ma7;ls;!s"
},{}],25:[function(_dereq_,module,exports){
module.exports="aKdar,eIfGhBinne,kund,loAn7offJsta6u3voraFwe6zu0;!r1s0teil;ammHtande;ec6ueck;eb1mh0;er,in;ere8rig;tt;e6i0;c0edD;ht;ckBs;er1in0;!ab,unt9zu;a1e0um,vor;in;n,us;e0ort;rn,st;inh3ntgeg0;en;b2llzu,us0;!einand0;er;!waerts"
},{}],26:[function(_dereq_,module,exports){
module.exports="&,+,aJbHdEeDfalls,inCnachCo8respektive,so5u4w0zumal;aehre3e1ie0ohingegen;!wo8;dHil,nn0;!g7;nd;bald,f1lange,nd1w0;eit,ie,o3;ern;b0dB;!g1wo0;hl;lei3;dem;he,ntwed6;a1enn,o0;ch;!ss;e0zw;vor,ziehungsweise;b0ls,nstatt;er"
},{}],27:[function(_dereq_,module,exports){
module.exports="d2ein0;!e0;!m,n,r,s;as,e0ie;m,n,r,s"
},{}],28:[function(_dereq_,module,exports){
module.exports="0:24;1:2D;2:25;a28b22c21d1Ve1Of1Ig1Bh12i0Zj0Xk0Rl0Nm09n05o04p01rXsJtCunAv8w3yoko;a6er5i4oh3to,ut;lf2Hnungsnot;edergebu2Hrtschaft1O;kstatt,leigh;f28llf2End;e3w-tocB;ag,rmoeg1L;i3s0AternehmenssteuF;!cef;a8elefonnuTim14o6r4u3;er,ge0N;auer3euha0M;!fei0;c3des16ec3;ht0;lf23t,u1X;a1JchAed,ozialh1Vp8s,t3uchocY;a6e4raf3u1V;e,kaKt1K;rbeh1Su3;ern;dlmay0hm0si;e3ur;rb0zi0Q;a7neeb1Bul6w3;e3ienbach0;i3st04;nepe1z;d,t02;er1Ju;a5e4ied2u3;eck,ndC;d,g2publiI;ch2f,umf1L;arlamentska4ds,e1hilharmon1Hlo,o1r3;aeamb2opaga1I;mm0;eko0Rno,pTrders;a4e3ot,ummS;tzha17ubau0;bel3to,z6;sch0O;aEeDi9o6u3;e4kakama3tt0;li;ller-mün9tt0;ni4r3;al,genpo1;ka;l5neraloel0Fss,t3;h0Xs3;chu01;ch;hrwert0Brk2taph0;ni0r3tthaeus-mai0uC;cia,ia,k;as5einwaDi0Xpgs,u3;ft3st;f0Wwaf0Q;ker-schuel0t;am5l4oerper00prf,u3;er,n1;a06ient2;eras,m3;er3;!n;ahresfri1uge3;nd;da,n3;g3s2;ebo4r0A;a7e5il4ochbu3rk;rg;degard,fe;i3ll0;di,mZrZ;ftFlbins2nd5u3;s3t;haltKtu0;!voll;e4glf,ia,osalia,u3;n1s;bu09d5gen4is2ld9rvais3werbekapitalI;es;d,wa07;enktaf2u3;ld;a7e6inanzhWlVo5r3uess2;au,eiheits3g,i1;straV;lt0rm2;d0i0;hZu1;-mail,g,hefr8inkomm6n4rb3;schaft6;dstuPtwicklung3;shN;en3;steu0;au;-mark,a5hs,oppel-cds,pa,r3unkelziff0;ittstaatenkla3ogenmafM;us2;g3u0;!m3;ar;ds,laudH;a5e4gag,ib2lutt3ru1;at;ihAtt0;chmann,erb2rm0yernhypo;er;el;bfDda,gBlicAn8r4str3;id;beitslosenh4m3t;ut;il3;fe;g1two8;st;ia;!e3;nda;ah3;rt"
},{}],29:[function(_dereq_,module,exports){
module.exports="0:IU;1:IS;2:HX;3:HK;4:HT;5:FX;6:I3;7:IO;8:I8;9:IL;A:IR;B:G5;C:IM;D:GV;E:HH;F:IN;G:GM;H:HA;I:GY;J:D4;K:IJ;aE0bC2dBGe8Wf8Ag81h7Gi78k6Ml6Am5Wn5Ko5Ep56r4Us3Yt3Pu2Yv0Vw09zL;a07e05iDuLwiA;e03f02ho2ko4l6Cma1ne8rRsMzuL;geCGla9mDTrecGPs60trI0weC;ammenMchLti4;au0reEK;arE9bI9fa9hFQko4sMtrHLzuL;fBHsD0treIK;cDYeBteH;echtzu3ZueckL;b3EeTfSgQhPkOne8trHHzL;aG8i3uL;drFKeRfüKgewiIPhAHkLzi3;aIKeKo4;aIJeK;ab0ol0;eLreGR;b0h0wiIK;aEKiC;ro9K;lIKriedenzU;ck0g6;ig0rL;bHSr0sto2;eFVhl0;a01eUiNuL;eLnF;ns1rd5;dOederLss0;aufz34erBQfiChMko4zL;ugHW;ab0erCAol0;erLm0;lJsL;eBpHHt3;cQgPhr0iterMnd0rLtt63;b0d0;arDEeMg3s3zuL;eLfAMma1;ntwiGK;faHne8;hs6k0;cNeFDhrMlt0rLs1;n0t0;ne8z2P;hLk6;en,s0zuEF;er01oL;llZrLti2;anWbeVd8MfABgHDhaEko4lTsRweQzuL;bNd8LfAAgMlJne8sLwePzi3;cA7teH;auk6eh0;eLriA;reEIug0;is0rf0;chLteH;iH5lGFreD4;eLiJ;g0s0;izu9RreEC;b8Ako4t73zuL;ko4t72;b88eCzi3;a13b0Wd0Tei0Rf0Qg0Ph0Mk0Kl0Hm0Fn0Eo0Cp0Br09sWtSuRwMzL;eAJicIoe6P;aOeMiLoeEYunF;rk7Rs1;hr0iLnd0;ge7s0;hr0nd6;nsicGKrsa1;ag0eLi3S;iMuL;e7f6;d5l0;aWchSeRiQoPpi8KtLu1;aMeLrE9;ck0h0ue7;at7FeL;nd5rk0;eEJrg0;cG9l7T;lbstaend5tz0;aNeEOiGElLwe5;echBEiL;e9m4C;eFRff0;eBSnd0;ecEBiL;cIn60;a9fl7Pulve7;eLr8K;d0ffent71;achlaess5icI;arkt0eAAiL;nFsC4tt6;aMeLi2;g0ih0;en5Rge7ngsam0ss0ut0;aG5leine7nLo4raC4uerz0;eEEueE8;aMeLinF;hl0im6Rlf0;nd6rr0;aeHeDIlDHoGGroesEK;aHo6ZuJ;nLt6;b7Zfa1ig0;aMien0opp6rL;aeAeifa1;nk0u0;au0eQiPleBLrNuL;ch0eL;nd0ss0;eLiA;it0nn0;et0nd0;rg0sE7ug0;bschi2TeMnLrB4;ke7la9twoC6;nFusE4;ebZmRnterL;biCdrBRg3maDYr6TsNweDFzL;e8Wi3uL;b6Ig3;ag0chMtLu1;e74ueB;aeBe9DreB5;bRdr3fa9g3kQrPsOzuL;bMg3keKsLwAP;chuFQeBtE6;au0riA;eE6teH;ei9ueCK;eKreEN;eneF9riA;eLrigbleAW;n,rL;bTdeBCfSg3l2JnRprüf0rQsPtNwLze58;aLeCYiC;ch0eEB;reLün1;ff0ib0;chreC0eB;as1ed0;acIe8;liJüK;liG;aeAFeQhema2PoPrLun;aNeMiL;mm0ump30;nn0t0;e9Zg0kDns35u0;et0le35rpe4P;ilLst0;h3Nne8zL;une8;a0Fch06e04i02kiz7Go01pVtLu1;aReQoOrNuL;di2eL;rz0tz0;aE9ei1;er0pLss0;f0p0;ige1Urb0;bi1We9Vrt0tL;io7BtLui2;fiC;aPeOrLu2;eMiL;e9ng0;ch0ng0;icDQrr0;r0zi2;n44rg0;cherLeg0muB5nk0;n,s8Az89;h0in,nLtz0;d0k0;aSeA7iRlPmNnaHrumC1ueMwL;eC6iA;r0tz0;eLi11ueG;ck0i9;aLenFie9uG;f0g0;ck0eb0;eCYff0u0;g0mm6ni2;ae1eOiNuL;eLh0i6N;hr0tt6;cIe1s38;aRchQdPf1ZgNhabiliDkMpa21sLtt0ziD;erD1pekD;laBMonstr3KruD;iLn0;er0st1X;en,u6B;n0tfAW;gi2liBT;aQflJlaPrL;aeNiva17oLu05;bi2du66fiLgnosti66t1Mvo66;li2ti2;g0s67;tz0zi2;ck0rLsBMt65;k0tizipi2;bserCMef6OffeMpe1LrL;ga03i62;nLri2;bMhaEzuL;haElJ;ar0le8Q;aOeNiederMoDuL;eBtz0;lJsc5Kzul0C;hm0nn0ut0E;chMheL;b3UlJ;ar89de91geA9hPlCOvOweAOzuL;de90g3hOko4lMpruLspi4HvNweAN;ef0;aCOes0;oll55;ol0;aXeWiNoL;bi05derLtiC3;niB0;lFniANssStL;ans3film0hQmPne8rOt2Swi81zuL;bLma1rNt2Rwi80;esLriA;ti4;ed0;a1is1;aEelf0;br1Mh7O;id0ld0;ch0ng6;a9eTiQoL;ckeOes0hn0sL;lMwe96zuL;sc4Twe95;a9eg0;n,rn;beLeBZnF;raL;liAG;ck0gMhr0iLnk0rn0s0uAD;h0st0t0;en,itiA1;a03enn01ipp0lXnVoPriSuL;eLltiBDs1;mMrzeL;n,rtrAM;me7;llabo08mOnMoLrrigi2;pe07rdi4Q;kreLsulDtrol8Szent06;tiA4;bi4NmLpenA3;en,uni4I;aLue9O;ck0ll0;aMet6CingeL;ln,n;er0rL;ma1;enLze4T;!zule94;ndi1Epp0sLuf0;cLsi2;hi2;dentifi46gnoRmQnLso8D;fOteMvL;esD;gOnsiAPrL;es9MpreD;or99;porD;ri2;a02eQiMoL;er0ff0l0;ev0nL;ausg3bla1Dde7gARlJne8wegtae6LzL;i3uL;ko4ne8we8TzufuJ;iVlf0rL;aNbeizuf3LhaErs1s54uLz53;eber3BmL;sc3Hta6Vzusc3H;bz6YnzuQuL;f38sL;biB5ko4sNzuL;fLhaEko4ne8s4Y;iCueK;p1OteH;f3Cko4zi3;l0rat0;lMndhLu0;ab0;bi2t0;aranDeMleichz6NoeAKrLuG;e8Pue9;bPfaeh7Fgenzus4Zh0lOnNstaEwL;aehrLiAHoe88;en,lei7P;ie9uJ;aAiAt0;en,rL;au1;a05eYiWlToOreMuL;e6Bsio37;iLu0;ma1zube37;erFlOrLtografi2;ci2mu76tL;seBzuL;f2RseB;ge7;anMieL;g0h0;ki2;nLr80xi2;an2Rd0;rPstL;haElJste1IzuL;haElJsL;chLteH;re5H;nLt5;haEzu6F;hr0ll0ss0;in16mpfe77nt0PrPtab6PvakOxL;isDpL;anLorD;di2;ui2;a0Jb0If0Fg0Dh0Bk0Al06m03n01oZprYrWsStRwNzL;ae71eLi16wiA;ug0;aNeLirt5B;ck0iLrb0;s0te7;e75rt0;e77r8C;chMeBp1AtL;a8ZiG;ein0ie9l9DuL;et3Z;eLicI;c6Yg0i1;e9ob0;be7eL;f2Lr3U;aeKeL;nn0ue7;oLut5;egLrd0;li1;aNeL;b0iL;ch3Md0;eu3Lng0ub0;e8Ula2;aEeb0oL;eh0l0;aLeh0re6X;e4Pt3G;aMiCoLreu0ueH;lg0;hr0ss0;riA;hn0r3Z;biCdeGfYgeVkUlSm2Sne8rRsOwNzL;auLi3;be7;e7Mi73;chLeCt3;aeLe2Blue15uld5;d5rf0;icI;aLed5oG;rv0st0;o4rae45;genLh0;ne8se72tr6YzuL;ko4seBwi3N;alMeLli3;rn0ss6;l0t0;ar3Hb0Gd0Ff0Dge0Ch0Bk0Al07m4Gne8or06paGquarDr04sZtr7CzL;a5Ki3uL;bWd0DfVgUhTlSm4Ene8rRsLtr6RweC;aGchOeBpiNtL;eLuf0;h0ll0;el0;aLr1R;eBlt0;ae31ei1icI;aZeYo7M;aEol0;eh0re5X;orFue01;e03iC;chNeBpMteL;ck0h0ig0ll0;ar0;aEl7OrL;ae3Qe4J;ae2QeiLicI;h0s0;dn0;aMeLo1;g0it0;d0ss0;a79eKl6C;aEeims0ol0;h0st3;a3Bl7DorFueL;g0hr0;ae4riA;eLiCriA;zi3;a03e00iWrUuL;ld0rchL;bRdr38fQg3lPsNzuL;dr37fPsL;cMeB;cLeBu1;hl5Y;a6UeucI;ueK;liGre1;oLueG;ss6;en0sL;kMtanL;zi2;rediDuD;ck0fiMmL;enD;ni2;em4Mnk0rMst3ue7vonLzuL;ko4;lJs0Qz0P;au0eSiRlQrNuL;ch0eL;nd6ss0;aMeLiA;ch0ms0;ndma1Uu0;as0e21iG;et0ld0tt0;a17de16e14f12g0Vh0Ti0Qjah0k0Nl0Lme1Rn0Kob0Jr0AsYtVuUvorzuTwNzL;a3SeLi3;ic40;aOeMirLunF;k0t21;g0is0rL;b0kstell5t0;elt5fLhr0;fn0;st3;g0rte3V;aReil5rL;aLe1N;cIg0;aen0AchReQiPorg0se7tLu1;aNeMi4rL;af0e2U;ch0h0ig0ll0ue7;et5;cUeg0;it5tz0;aOer0im3QlNneMoen5rLw2;ae1V;id0;eun5ie9;ed5ff0;aSeiOuL;eLh5;cksicLhr0;ht5;s0tL;sMzL;usL;teH;pp0t0;acI;e5BuB;a9eLo31;b0g0;aMl47o4raeL;ft5;em36nntg4V;sMtr44wo2WzuL;be1SlJtr43;te3F;aLeb0;lt0nd6upt0;ePi50lOnuJrL;eLueC;if0nz0;eg0;ei1ueG;gn0h0isL;te7;a9oerFrL;ag0ei0;inLnd0;druGflu9;ut0;cInLr02uftr3N;staCtL;r3Lwo13;b33e30gi2kzepDn1Mppel1Lr1Jtm0uL;f0RsL;b3Ld0Neinander0Lf0Jg0Hh0Fk0Cl0Bprobi2r08s03t01u48wYzL;a20uL;arVbUdTgShRlPma1nuBrNsLta00u46weiY;ag0cLe3Ap3Ut01;hl4I;aeLicIuf0;um0;ad0ie46oL;es0s0;and6;eb0l1Mre08;e1Zr0D;au0i4Jre16;be15;ae1NeiMiL;rk0;s0t0;aLreQ;us1;chNeh0p3EtLu1;a3NeL;ig0ll0;aEl40reLue3L;ib0;eLicI;c1LiL;ch0s0;a3Oie3Mo3L;o4undL;schaL;ft0;aLeb6;lt0nd6;e10l0ZreL;nz0;aHueL;hr0ll0;seBzL;useB;eMrLue3G;ueG;nk0;b09d07faHg06h04k03l02ne8rZsXtVwTzuL;bRfOgNhMkla2lLma1ne8po0CsWtr22zwiA;eg0o34;aEeb0o2;eb0re1F;aMrL;is1;ll0ng0;au0es1Lr3E;aLeL;rt0;e0WreL;ib0t0;tLu1;eHoG;eLoHuf0;chtzuerLg0;haE;a2Ro2O;la2o4;aEeb0oL;er0l0;e05re0X;eGrL;aeA;au0es14i1Er2XueL;rd0;beLtikuM;it0;li2;aly0Wbi19da0Ve0Tf0Sg0Nh0Li0Kk0Hl0Gme0Fn0Ep0Br09s02tr19w00zL;i3uL;bi17e0RfWgThSkRlPn0CpaOr2DsMtreLvertr1JweC;ff0t0;ch04e19ied6p1TtL;e0Qr23;ck0ss0;aLeg0;st0;l19o4u09;aEe0C;eMlL;ei1;b0h0;ert5;ig0;aeLeC;hl0;chQeBpNtL;eLreA;ch0ue7;oLre1;rn0;tz0;au0l1Y;ecLuf0;hn0;a9eMreL;is0;il0;ae17e8;ld0rk0;eg0oG;aemMuL;rb6;pf0;mi2;aEeLo2;b0iz0;eNreMuG;ck0;if0;b0hL;en,o2;aAorFueK;iLrke1A;gn0;ue7;si2;ti2;cInFusL;se7;ht0;b1Af13ge11h0Zl0Une8ruCs0Ct0AverlaAw06zL;i3uL;b02f01g0PhaEjZlXmilFne8rWsRtrQwLzi3;aNeMiL;ck6;i1nd0;eLrt0;hl0lz0;et0;chOeNic0BpaEtL;eHi4;ll0;h0tz0;a0Fi0El0Su0A;at0uts1;eLie0Ho0G;g0hn0s0;ag0;lt0;eFueK;au0;eh0;aMeL;rf0;eLrt0;lz0;au1rLun;ag0et0;ag0chUeTiRolPpOtL;eMi4;mm0;mp6;re1;vi2;er0;cLtz0;he7;gn0tz0;aQiPl03oOreNuL;ett6;eln;ck0ib0;tt0;eb0;ff0;hm0;aOeNieMoL;es0;fe7;g0it0s0;uf0;aLeb0;eAlt0;b0wiL;nn0;eFiClMueK;hr0;ie9;ss0;nd0;de7;rn;au0iOrL;e1iA;ng0;ch0;ld0;en"
},{}],30:[function(_dereq_,module,exports){
module.exports="0:BU;1:C1;2:BO;3:BT;4:BA;5:C0;6:A3;7:5F;8:AO;9:8K;A:BS;B:AR;aAFb98c8Sd8Je7Vf6Zg6Bh5Mi5Gj57k4Dl44m3Pn3Fo37p2Cr1Us0Vt0Eu06vXwLxiao1SyKzC;aeh6eHiGuCwa1ypri95;eg0ga1kae1OsCwae2I;ammenCc0It09;ha1sC;chC4to9U;nsBWvi6W;do1itCntralraArou95ug0;g89raBLso9Vungs2F;ig93o1;aLeHiDoC;lfBKrtla5Q;derspB1lDrC;kungsgr4DtschaftsBF;lenCs4;!be7A;chselBLiEltDrt0stC;-p0en6Y;kriB7m72raBB;hnachtsbaBAne;gChlBBld,rr0;en,goAI;eFiEorC;b8Jga1ha1jahreszeitB5o90ra1sCwuerf0;cAQi86pK;etnam8Cttor7L;rCteran0;bEda9Eein5Xh9Vlu2sCt9K;e,tCucBG;o96yn0;ae9raucherpr91;eberImGnErCs-97;nenAZspCwaB;ru1;-94f9Mm53terCwi9N;ga1nehmensgewin6;fa1ga1stCwelt2V;ae9;ga1sch0W;aQeMhKiJoFrCsche5Duerk0;aCes0o3T;kt7uC;ergae2m;desscEeDn,rCuK;er82nad82;ne,pf0;huB0;erv9HscAX;e8Gier5oCr4;mA7rvaB;ilErCsAxt0;mi6roC;ri2;en,nehme27;g0milenCnz,rif2O;!rebe92;a09chXeUiSk30lowak0oQpNtDuedCwi36;en5Uo2paz1Gwe2;aIeHolGreiEuC;dCehl0;e3ien9H;fenCk,t5Q;!w4I;pe,tU;i2Gr2Gv0;atCdtte9Ie8Shl,ndo7Uuse0;en,sC;b4Jp7JsekretaA5;d-6Xe3Di4Dons7rC;it,uC;eng,ng;eh6ld8mmernachtst9TwjeAyin3CzialC;d70i2plae6staaA;cherheitsCn6;g4Lk2R;g0kt7nCrb0;atCi7s7;or0s;aLeJiIlachtbu8FmHolz,rGuEwC;aCu1;n7WrzwaB;es7Rhe,ldC;en5E;e77i64;erz0i5Uol5U;enen6Ql7Em4;rbenhaCwardnad5;uf0;d4Yed0rCtt0;pi1;al,e8Xft,rg,tell59;aSeMiJoGuC;eCmaen0ss0;ckChe;en,ga1schlC;üs5;nDtC;or0sti42;!aB;e79ngDos,sCval0z6L;ikofa2Xse;!o;be7RchtsGfe1XgDh5iCkt7praesenta3ser12xro5C;cht8Yn79z;enDiC;erungsk1Wss68;!waB;ext4Ys30;hm0mi8Rng,tko,um,viv;aZeWhilViUlRoOrDsych6RuC;n82ts8L;aesidentLeJiIoC;duFfEtCz6V;ago5TestC;a3en;ess7it;ktivitaetszuwäCze3;ch5;m8Anz8Svat47;i6PsseC;bericht0;en,schaftskand1T;lizDol,rtCst0;illo,ugi5M;eik1Di2;aCeitg0;eCn6F;ne6Ntz0;cass5QerrEl5M;ippe,osoph0;nDrC;ot;!g;es5nHp4rFsEtDzC;if74;ie3riar2Pt0;sagi88t7;kCtei50;!pl7C;et2Ots2L;berIeGffizi84goni-ZrDsCt80we77;t3HwaB;der7WganisDtC;en,sverein0;at7m0;koClk6H;l5Rnom0;kommandiere9on;aGeEiDordC;en,o2we2;chol7Eed2Blako1V;ls4rv0uC;an40ba6Q;chEehrbod0m0rr0tionalC;i2sC;o0Yta8;baCfahr0;rs5W;aPeNiLoEuDythC;en,os;enteferi1s6Lt;enc7RnaHrGsC;c7QlemC;-Cs;aktiC;vi2;d0g0ill4;r1Tt2Z;nisterp4QtgliedsCyazawa;s5Kta8;chanism0nC;g,s1P;er6Cn0Tr3Isssta1Ntthi6S;aJeHiGoC;bbyi2eDhnC;absch7E;hCw0;ne59;ami6ban4efe3Rn3K;bens6TiCon;be,tzins72;ed0fontai6i0stw17;aYen,inderWn0ZoGrEuCw4;nd0rC;d0on,se52;eCi6Ko8;d2Li4U;eQhlhau3Bll6ImNnErrCsteng1G;espon48uptionsskC;and43;fIkurHrGsEtDzernC;e4Vs;inent2Arahe3;e5QumC;!e3;ad;re3;erenzkClikt25;reis0;mDpC;liz0o3Eromis5;and3Ku3D;pf0;ga40sC;chuh0o4F;mpfeins5HnGpita0rCtholik6D;amira,din3MlCst0;-ChD;hCot64;ei0R;al,dC;id8;aIeHiGoEuC;d0e09ngsoCri2;zia14;ch0e1QschCurna13;ka;a1g3B;ns,ts;cks4hrCns0;esan24ga1;de3Ng-metall-2Ompul5nErDsC;a1la1S;a4Wrt5Mvi1;dustries41go,itiat7sa2AteCvest7;nCresse3;da3;aKeHiGoDuCwa1;ngerstre4It;chschulreCef0;kt7;or0;nw3Fpparc2U;i03lDnCrr0;ni1r4C;d5JmI;berm50eQf0k0nIrGusC;en,haltC;en,sC;!sC;tre4J;aBtmC;ut;dlungsspiIg,sC;!-Ce8geo0X;hFjC;oDueC;rg0;ch0e0T;ag0;el4U;f0upt2S;-38aVeLinzbu0PlaKoIrCuld0;ad,enzuebGieFossCue9;bCku9ra4R;etriC;ebe;ch0;er4P;izueCldsto6uvern1Y;ta;nz;dank0fange6nIo0FrGsFwiC;nnDssensgC;rue9;e,s;a1ichtspun3Qundheitsschaed0;h0Qichtssa1XstensaC;ft;eraCo11;el0lC;!inspe1L;eEmsachurdia,ng,rt0zaC;-sCsC;treif0;rt0st0;a02eZiSlMortschri0RrGuC;eEnCs5;damentaCk0;li2;hrerschei3Br2s28;aEeCiedL;ddie,iCu9;d15landv2X;geb1XnC;k0zC;!o22;e1JuC;echtling42gC;haClots0;ef0fC;enC;!s;lGnDrmenCsc43;ku9;anzCn0;e1Ejongl0XmC;aer2V;ipin10mC;en,s;i9ldCrd0Ytz0;beC;rg;d0eFktEnDvorC;it3M;g,s;en,or0;d0ll0;be17g4hrg2WiSlRmNngKrJtIuGwaBxC;-Epe12tC;reC;mi2;kommu0Ap0Q;-Cg0ro;kommissionsp0Os1J;aAo;b0loe18;elhCpa3H;arC;dt;iDpC;fa1;gRlC;io;efa3lemann-jens0;dgGnCsr2O;b2Bdring0Pf37gEkla1sCzelvert19;ae2CchniC;tt0;a1r2C;enoC;ss0;aIeFiDonalds4uC;ft,rch2M;eCplom8s05;n2pg0;al,moCng;kr8nstC;ra3;eChrendorf;mon0n0;aQhFlint4ommonwealth0Rsu-C;vorsiC;tze9;nd0;aLeHinGrC;istDoC;ni2;dCen;emokr8;es0;fredaDmieC;rie5;ktC;eur;ot0;rlEst1V;a0FeXiVluem,oRrKuC;chstab0ll0nDr15ss0trC;os;desDzenthC;al;pCs07;raeC;siC;de3;anFei,iDoCunn0;ck0;efCt0;en,ka2;cheneCdt;xpeC;rt0;d0eCg0rk;d0rsenC;ga1neuC;li1;olC;og0;amt0itSlaRnOrIsFtriebDwCzirk;ei5;e,sraC;et0;chluCen;esC;seH;eicheGg,iFtEufsC;soC;ld8;hoB;chA;!n;!eluxC;-sC;ta8;ng0;ra0P;c4hnhoef0lk4rnevTuC;loew0m,stei6t0;ne;b12erzt0ffront,ge3irporAkt0Tl0Mm0Kn04ppet03rWsRtMuC;fIgenzHsEtoC;kCm8r0;onzerW;flu0Hga1nahmefC;aeC;ll0;eug0;schDtraC;eg0gs0H;rei,wu1;em,laEomC;tesAvC;ersuc0R;ntCs;ik;i8peKtC;a,ronC;aCom0;ut0;at0;beitsGchiteFeEnoBtiC;keln;ld;ns;kt0;plC;aeK;it;aPdLfa1grKrJsFtCzuS;eDonC;!io;il0;aeEcDpC;ruec06;hlaM;tz0;eiz;iff0;ers4rC;a1eC;as;on;ly2rC;chi2;aJtskollC;eg0;!berHkohol,lFptDvaC;ro;raC;um;einC;ga1;to;eurGiC;enEonaDvi2;st0;er0;kur5;!en;ts;nt0;en;ga1sC;chDtricC;he;luC;es5;se;ng"
},{}],31:[function(_dereq_,module,exports){
module.exports="0:E7;1:E5;2:DH;3:DS;4:CI;5:DX;6:CM;7:CJ;8:DW;aCEbAUcAOd9Te91f8Ag6Yh68i5Tj5Pk4Fl40m3Bn2Vo2Op24quart23r1Rs0Yt0Gu08vTwGz9;ahl04eDiCu9y2X;eriC6gestaend9Asammen9;lBOs35w9;ac2Zi16;el6mm1t62;hnt2i9ntr0ug;ch0ta7V;aHeCiAo9u9S;chenend0ert1hlwoll0lfenbueDFrt7Z;e9sm9H;n,sC2;iCrkBs9tt1;en,t9;d2Cf2Ljordan4;e7Us;hna7Qssruß4;hBn2Trsch9ZsAtt9;!enme1;hingtAZs4P;lergebCQrzDD;at5XeGiEo9ukov96;elk8lCr9;biAAgC1h6Ejahre9kommCNstandsmitglied76ur7Gwo8O;n,s9;!nive9R;k3um0;chy-reg1Adeo,e9gDHlniDKsi1;lfach3rt2tnCT;hik2r9;bDdi4LfaC5gnuCNhAkehrsCTmoCNn8Us9tr3E;ag0p3R;aAo1uet9;ungsCQ;elt8Elt0;reCZundu6V;eberFf1mDnArteil9s-repraesentanD9;!en,s;gAhe72ter9weAI;haD8n8L;aB0ezief1l68;deAXla7satz9;minD5plD5;e12lAKmaBE;aPeLhHiGoErCscheBu9;ch9eb62neC9tzi4N;!olsky-zit4X;chi0tscheCH;avn25e62i9;bu17eAL;des9r6ulouBX;opf1urteil6;bCGer6;ai4e9uer5U;ater9m0;!haCSs9;!t5S;am,herCNl9rritoC6;!e9;fon9kommunikations7Z;!e,gespraeAK;bCMdschikiCCgebue2HiwCJl3uziAZ;aZchReQhando46iPloweC2oOpMrinag81tDuAy9;ri0st0H;b0Oed9jC4;frankr3Vos9;se2PtaBO;aDeuergeCich3Xockholm,rAu9;di0eck6Cttga7F;a9eichhoelz1;f4Glsu7ssenki82;heimn97ld8;atsBbilitaets2Ydt9edtBY;schloAKwe9;rk0;d4Poberhaeupt1t8V;aBOekt8Fiel9;!zeug;ftwareC4ndierungsg6B;biBKlve8Anga1W;chst2kretari3Zme89r2V;aEei3EiffDkop87lBmier8Nott4rKwe9;d0i9;g0ne5;a9eppt84oss8Z;chtpf9Mg3F;!e5;fe,u9;fen81s0S;ar9c0Mig91ngerhaus0udi-ara2M;brueck0la7;aJeFhein4iDoCu9;d1eAhrgASmaeB8ndschr9ss7U;eib0;g0ssels1A;sto84tAX;ese7Nga,nd9sik0;er5fle60;chnu8XgBiAnn0praesentantenhaus8Ls9utl4Lvi1;ervo33t-6Cult3G;ch8Jseu52;im3;ed1sta9FtBGuB4;e9Ei1;aPeNfLhaenom0ilotproKlIoGr9;aEe7WiDo9;-kopf-eBblAdu9f56graB9je9ra,tokoA8;kt6;em0;in77;nziB1vile4O;ba2Tg;k1l0r9sEtsdAH;t38zellB3;a9us;edoy1kat0;je27;arrB1erd6lich9u7;tfa8Y;acekeepi2Lki2Zrso9;na5I;kApier6r9ss73;adi3ke8Vla9Ptner5R;et,iAM;bDeCffen8EgoniBhr0pf8rc0Hst9xford;d9slawonien37;eutsch4;-volk3la7;ko-aud5Dl,sterr50;dachlosen0Ber9je1Ust;haus4Mschle9W;aJeHiDor9;d9w9T;bosA3ir4rhein-westfAzy9;pe8E;al0;eAger9ve6O;!-del93;dersac9mands4;hs0;st,tz4Cu9;-del1Lg6Fsee6H;ch9hrungs93shoern1;barlaAs9;pi2;en9nd;de82;aPeMiFoCu9;enAs9tt2E;e0ikt6Tt1;ch0st1;dell76rsl7Ks9tive5v0Y;amb9kau75t5J;ik;ami,liEnDsstrYt9;gliedAleOtel9;!a3Qme1n;!er5s9;!l1Q;is0Kus;e9Vta1;cklenburg-vorpomme7NdiAer,gawa7Sis9lbourne,nschenre3Psse1Hta8P;s0ter-baf7T;en,ka8K;drFed9EiEl8CnBrkeAss9teria4A;!akSe;nz9Bti1A;cAd86n9oev1;heim;he5S;la7nz;id;aKeHiFoDu9y6Q;dwig3MeBmAx9;em6Lor;pur;be5Vn0;b,ch,e9nd6L;ch1;by0c31ed,ssab6Jt9;au0;benAd1e6Wnz9tt5Dut9;kir76;!s7Y;b4Och0denschlussg23eAg9nd67teinis8U;er45;ch4Pnd8;a07er54i02lZnYoKrBu9;erz2pf1r9;di8Ssbaromet1;aEeDiAoa9;ti0;egs9te8F;g7Zverb9;re8K;ditinst0Luz3;f7Fnken9;be6Sha9;eus,us;ble35eLlJmInCpAr9;n,ps;enhag0f9;-an-kopf-re7Uki8S;kurs7BsDt0vergenzBz9;e9il;ntrationslag1pt0rt;kri9;te80;ta2Wul0F;ite3man4W;lektivs,um9;bi0;ln,nigrS;ie;agenfu3Dische3o9;e4Ist9;er5D;el,gali,n9rchenvolksb6Osangani;d9o;!e9;r9s;!n,z41;bine63iserGlEnin7SpitDrBsAvaliersdeli9;kt;ach7TchmMs2;atsc9lsru29tel4T;hi;a2Jel;i9ku2;b1for7F;rAslau9;te5P;ei5S;a9orda7Bu2N;-Ahr9kar6Ep7Qzzfe5G;e1Qhundert6tause7zeh6O;wo2R;mLnAr4sra4Rta5Wzm9;ir;dFkrafttret0la7nEsCterAvestmentbanki9;ng;e2Kieu9n77;rs;ekt0t9;itut0;e5Bsbru3Y;iBone6Oustrie9;l9u0Z;ae45;en,vidu0z;it9mobilie3D;at;aPeJiGo9undert0;-chi-minh-3LchEeAf,l4ngko9rm4Ht4Bust4H;ng4B;chstBr9;ge9n1;ra6R;ma5F;lohn4wa1T;lfs6Nn9;der61t9;er4;bronDer40ft,iBkt2GlArz9ss0u;!en,ogenaura4W;ler33ms-burton-29sinki;l69m9zo2;!at4;!-2R;aGeFlbjahr3m3YnCsch18u9;ptquarti1s9;!e3Uhaltsd9;efiz1D;au,d9nov1sa-spar2H;el9tu4M;n,sb10;us8;g,r;ePiNlMoKrDu9;atemala-2VeteBt9;a0Eh9;ab0;r5sieg2;emi0iechEossDu9;en,nd9;gAs9;atzur05tueck6;esetz3C;britan5SuU;en4ische5;ett9rl3P;ing0;ue2N;ft,pfeltre9;ff0;b00de3VfYgenWhUlOmKn,orJpae2KrGsBtrae3Vw9;a9erbe35i66;e0Rnd;amtmeta4WchAetzYicht8praech9tod0undheit3E;!e5s;aeft9i2FlNos4Z;!en,s9;fe2Jv49;aeAicht9ueR;en,s4I;t0usc01;gi0;einschaftsuBue9;se,t9;!er;nt11;aCd9;eAha9;e11us2M;r5s;ec9;ht1;ae9i3Bo1;lt1;te9;il;aeng0Be9uehl0;cht0;aeudeAet,iet9;!e9;n,s;aUePiOlJor0rBu9;e9tt1;hrung1Enft2;ankEied9uehstü1M;ensArich9;shaf0;ab10g9;espraec9;he;fu00r9;eich21;aggschiff,eCoreBug9;b9zL;la2U;nz;is2R;er,nn4;hlverhalt0ld8n0YrnsehCstAu9;er,illet1Y;iva9la7spiel4P;ls;due3Jen;ch,ech,hrAss,x,z9;it;waAz9;eug6;ss1;cuadZhepaYiRlPnLrEsDu-Cx9;-9emp2il;ju9;goslawi0;lae03;chbo26s0t4;be,dEeigDfuCgeb9mittlungs2Zstaun0;ni9;sse9;!n,s;rt;nisse5;b1Mgescho2Go2;d3glBsembl3t9;setz0wicklungsla9;end,nd;a7is1Z;e9sa2B;me2Wnd;!er,gentumsv2Wn9s0;fCgreif0ko3Ule1PvAwanderungs9zelanli34;gese24;ern9;ehm0;amilienhae9uehlungsvermo30;us1;ar;or;aZeSiPoIrCu9;eAnk9schan1Ktze7;eln;ll,sseldorf;ama,eCitt9;el,la9;e9nd;nd1;h9ieYsd0;bu1E;erfEku28ppelAr9;f,tmu7;besteuerungsAz9;imm1;ab9;ko37;ch0er5;amante9enstmaed2Wng6sziplinar1W;ng9;eschaeft;bEfizit6kr2RlegationDsAtail08utsch9zib2;land07;aAogestr2s9;au;st1;smitglied1;ak2;ch,eBmask2Zr9t0yt06;l1Bm9;stadt;ch8;hCoAre9;do;meba9rps;ck;e9il3;mni0X;a0He03iZlaXoUrNu9yt3;chLdKeHkare0Blga24ndesCrgtBss9;ge9;ld1;heat1;aCg1LkriminaBla9;e9ndJ;nd8;la9;mt3;ch8nd9;el,n9;iss3;apeZg1X;!eD;aDem0u9;essAttoinlandsprodukt9;!es;el9;!s;nden9si0B;burgs;livi0nn,rd,s9;ni0t9;on;e9tt;tt1;er,ld9;er5u9;ng9;sw0Y;dKiJkanntwIlErBs9tt6;chaeftigungsverhä0Rtr9;eb0;g-karaAn9;!au;baM;faBg9;i0ra9;ds;st;erd0;ne5spiel6;aueBe9uerf0H;nk0;denHfGgFlleEnCs2uAye9;rn;gewer9spar0;be;d,glades9;ch;tt;!an;oeg;!-9;bad0;b10e0Wfghani0Vi0Tk0Nl0Gm0Dn07rUsRtMu9;ck4fFgeCktions13s9;chwiAla7maDsterb0tra9;li0;tz;n9s;!ma9;ss;bBsAtragsv9;olum0;eh0;egeI;la7;nd;eli1h0lanComkrafBtent9;at6;!en;twerks;ta;erbaidsch0Ji0yl9;verfa9;hr0;beitsCchiv0gAme00znei9;mittel5;entiYu9;meC;gGlosengeld3vCzeit9;koAmode9;ll;nt0;erhae9;lt9;nis9;se;ebiS;daluDgel3kara,liCsAw9zS;es0;eh0i9;nn0;eg0;si0;mXs9t3;terd9;am;baEgClheil9t1;mi9;tt2;el;e9i1;ri0;ni0;t9w;enzBien9;pak9;et;ei9;ch0;ds,r3;es;stF;gypt0mt8thio9;pi0;er5;!n;enEgeordneBhoer0idjAko9;mm0;an;ten9;ha9;us;deAteu1;er;ss0;en"
},{}],32:[function(_dereq_,module,exports){
module.exports="0:33;1:36;a2Yb2Bc29d1Ze1Rf1Lg1Dh18i14j10k0Tl0Sm0Dn0Co0Ap01rUsItGuEvAw5york,z2;ahl,eit3u2;kun1Isammenarb31;!u2S;a5e1Eirtschaft4oche2;!n2;!ende;!spolit2B;ehrungsuni1Whl2Pig13lesa;er2orstand;antwor2Kg3handlung1kauf,tr2;ag,et0;angenh2Rlei2D;hr,msa1Kn2sa;i1Qterstuetzu2H;ag0Ohema,o2;d,nn1;aCchAe8he19i6o5p4t2;a2und1;at,dt;d,rech0;mm0nnt1V;ch2tua0B;e00t;ite2pt1J;!n;r2u17;itt,oed0;c0Hm1D;abin7e3icht2olle;er,u21;fo0Sgi3publik2;!an0;erung2on;!schef;!s;ar8e7la0Xoli5r2;aJo2;blem01dukVze2;nt,ss;tik2zei;!er;rs01t0;is,lamEtei2;!en,t18;effent7ktob0pposiOr2;ganisaNt;igeria,ov0W;aCehBi5o2;eg3n2;a0Ut12;lichk1O;chaVlli6nister3tt2;e,wo18;!pra2;esid2;ent;a17on1;rh1H;e4i,n3r2;kt,t13;ag0n;nn0rz;age,eu0Hoesu14uxemL;a7i6laus,o3ri2wasniewski;eg,t0P;ali3hl,mm2nzern;ent06i08;ti08;lomet0rcC;mpf,n0L;a3u2;li,ni;hr2nu00;!e;g,n2;forma2stitut,vesti2;ti2;on1;a3oe2;he;elfZm3nd2uptstadt;el;burg;e4r2;enz1u2;nd,ppe;fa00ld,ri0Rs4w2;a2erkschaft1i0D;lt;chichQellscha2;ft;a6dp,ebruHi4o3r2uE;au1eitV;rm;lm,rm2;a,en;ll;in6n4r3u2;!ropa;folg,gebTklaeW;de,t2;scheidu01wicklu01;fu3sa2;tz;ehR;dr,e8i4o2ruO;ll2nner6;ar;en4sku2;ssi2;on;stC;bat3legiert1mokratie,z2;emb0;te;du,h2;ance,ef,ina;aMeDild,liCoerse,u2;e9nd2;!es2;kan6re4t3we2;hr;ag;gie8publ2;ik;zl0;nd2rg0;nis;ck;deu8gi7hoe6r4su3teiligu9voelke2;ru8;ch;iHl2;in;rd1;nn;tu2;ng;nk2u;!en;mt,n8p,r3u2;fgabe,ssenminist0;beit2mee;!geb0nehm0s2;losigk2plaetze;eit;er;gab1si2teil;cht;en"
},{}],33:[function(_dereq_,module,exports){
module.exports="a7beim,durchs,fuers,i6u3vo2z0;!u0;m,r;m,r2;eb0ms,nt0;er0;m,s;m,ns;!ns,ufs"
},{}],34:[function(_dereq_,module,exports){
module.exports="a1Gb1Cd0Ve0Lgenuege1Ni0Aje02kein00lYmQniPpaar,sJunsIvielHw1z0;u0Tweierl1L;aEe9i7o0;!b1Jdur5fu0QgAh4m0Cna5r0von,zu;a1in,u0;eb0Om;n,u0;f,s;er,in;ch;e0r;so,vA;lBm,n2r,s0;halb,w0;eg17;!ig0;!eQst15;nn,rum,s;!e0W;!erY;aemtli06eineYi4o0;etw04l2v0;iel0;!e;chT;ch,e;chts,emD;an6e1i0;ch,r;hr3i0;n0ste0B;!e0;!m,r,s;!ere9;!ch2;autUetztere0;!r,s;!e0;!m,n,r0Ds;d4gliche3m0neF;and0;!e0;m,n;!n,r;e0wedL;!m,n,r0s;!mann;c9h5nwiewe4rgend0;ein1we0;lDm;!e0;!m,r;it;m,n2r0;!e0;!m,n,r,s;!en;h,k;benso8in5r,s,t2u0;ch,er,re0;!m,n,r;li1w0;as;che;and1ige0;!n,r,s;er;viel;asselbe,e4i0u;ch,e0r;j6s0;!e0;!l3m,n,r,s;in9m7n6r1sse0;lbJn;e3gleichIj1lJsel0;be1;enige0;!n;n,r;en,jenigDs1;s0zufolge;elbB;!e0;!m,n;eide1iss0;ch7erl;!n,r0s;!l6;ll1ndere0;m,r,s;!e0;!dem,m,n,r0s;!ha2l1meist0;en;ei;nd"
},{}],35:[function(_dereq_,module,exports){
module.exports="aHdreiEeCfuenfAhundert8ii,neun,s4t9vier3z0;ehn1w0;anzDei5oelf;!eDt6;!zB;ech1ieb0;en1z9;s0z4;!e8;!t0;ausend;!e5z0;e8ig;in0lf;e2hundert;!e1ss0;ig;in1;cht1ndert0;halb;!ze0;hn"
},{}],36:[function(_dereq_,module,exports){
module.exports="0:IV;1:H6;2:IM;3:I5;4:IQ;5:HM;6:IL;7:IF;8:FS;9:HR;A:GO;B:IT;C:FC;D:EC;E:HO;F:CS;G:IA;H:F0;I:H3;J:I7;aGCbDGdCTeALf9Vg86h78i75jube4k6Pl6Bm5Wn5Mo5Lp59quitDLr4Xs3Lt3Bu2Iv0Vw06zK;a04eYieh84oXuKwa5;eBKgeSlRn3FrueckOsKtreI2we9;ammengeLtK;eh0im5N;bJ6fu9ko2schlIWtrK;ag0oHY;b83geKkehCverwiGzieDS;b2OfKga5ha4no2rJ5scCRtrAwiGzJ;a31u9;asHEeEZ;g0Tla6me6no2sK;aHOchLeh0pIZtK;a9o6;lGWniIMob0ri7;eg0g1;iNrK;leESri6sK;cCHtK;o4TriIH;chneKg9F;!n,t0;ehlAHhCT;a03eViNoMuK;eKrDQssHS;hl0nschHTrDPsFD;hHLllCArd0;ch0dNeLll,nk0rKsGX;d,ft,kEV;derKg0s1;aufg2Og4JhoCL;erKmA;fIErIHsK;etBHprKta9;aFJecD1oB;ggeQh0iLrKtt0;de,f0tA;gerNnt0sMteK;rgeKt0;g7ko2;en,s,t;e,n,t0;faGSla6;chGHeNgt0hrg2BndLrK;!en,f1ntDtA;eKt0;lt0rt0;chFHh4re3;erYoK;llzJrKtF;aSbeRentFMgeMherLlKseCL;ag,eDU;ges86sFU;dB9fHTgNha4ko2lMno2sKtrFTwoFNzJ;chKeh0t6D;lFRob0ri7;ad0eGG;a5eb0;ha4i6D;nLrbeitAusgeK;ga5s7Y;geKkom42;ko2t8R;a0Qb0Md0Keinba5Gf0Ig0Gh0Ek0Dl06m03no2oeffentlicEEr02sRtOurteiHwLzK;eENicCG;eiLiC4oK;b0rf0;geCst;an,ei5ErK;aKet0i7;g0t;chQeh0iPpNtKucE;aLeKie6o8AriEHue9;h8ll0;en58nd1;rKuFF;aEDecBVicE1oB;ckeCnk0;lGVmolz0ob0ri7wK;aLiKu9;eg0nd0;en9Mnd1;at0oGQ;ag,iKocEut0;eKsFCtte4;d0t0;aOetzC6ieNoK;er0rK;!enK;!gega5;f1h1re,ss1;d0ngD4sF5uK;f0tete;au4ZoerpeCM;aKi2Vo3I;e5ftDKlf0nd91;aKe6liDT;ng0ss;i9ElKolF0ueg8;og0uechtBY;eutliBiKoG0;c28ent1;arg0iMoLuK;cEnd0;rg0t0;n8Yss;bschiedD9enEFnsta4;ebWmUnterKrt7W;bSgRhQlOno2sLwoE4zK;eichnEJog0;ch7FtKucD3;rKuet9B;eiBiDD;aKieBW;g,uf0;a4ie4;esch4Orab0;leib0roB;fasDIgeKstel4woFI;b0ga5he,ko2stiEL;erLriggebKt0;li7;einsti2fVgTlSnRqueCsNtrLwKzeuBV;iGu9;aKoEO;f0g0;chMeh0prLtK;a9eB6;a9Du5;lDPriFF;eh25im22o2;eE3ie8A;eKo6;b0ga5;aKlJ;hr0ll0;aReilOi76oetArKu8;aMiLuK;eB7g0;eb0f3Pnke3;eABf1ge,t1ut0;gLnKte3;ahm0;eno2;et0nzDJuK;chDIg0;a0Sch0Ae09i07k6Lo04p01tKuAAymboli2P;aVeRiPoOrLueK;nAAr8A;eKiEVoemt0;b0iK;k0t0;ppt0sDG;eKmmt1nk0;g1ss1;ckBCh3UigLllKueC;!en,tD;eKt;!rt0;e9gnFmmB8nd1pe4rNttK;fLgeK;fu9g7;a9Iin7D;b1tA;aDTe72iel1ZrKueC;aKec9EicBK;ch1eBng1;lKr5K;idarisFlK;!e3te3;cheCeh8gnalisiCSnKtz9U;d,g0ke;he,i1tztD;aZeXiVlSmi74nRoE6rOuLwK;a83i9;erLfKl70;en,tA;f0t0;eiLieKump9Q;!b1;bt,t0;eid0iDZ;aLieKo6ug0;f0ss8;eCWge;c9GeK;n1ss0;iKr0;d0n2XteC;eKfft1uD9;me,tz32;eLg4Oh1mme4nKss1;g0k1;he3ss0um0;aUeOiMol4uK;eKf0tscE;ckD2gt0st0;cKef1ss1;htA;agier4GbellFch89dOgeNiLklamiCYpraes7NsK;idFul81;ch2RsK;s0t0;le,neriI;et0uz7K;eumtDg0ng6Gt0;aTeil0fle9JlQrK;aNeisgMoK;duziKfi4WphezA6testF;er8;eg7;eKll0;gt0sen4S;aLueK;ndeC;edierCOn9O;k7LssK;e3iCG;blieBOeffnAffenbaCBperF;aPeNiKut6B;edergeLmK;mt;ga5la6sc6T;hKig0nD0;me;chLehKg0hm1nnC7;erg20m0;empfu9geK;g7ko2la6wiG;aVeUiOoMuK;ess6MsK;izFs1M;cEeKniB2;chBZge3;sNtK;geKmacEteilBX;hoKno2trAQ;lf0;chAXsK;la6Aversta9;hr0in06lde1D;chLg,hn0nge6QrK;kiIschF;e,te3;aSePiLoK;b0esBPhBRsg59;eKtt0;fKg1AssD;!eK;n,rBL;bt1g31hnLiKse;d0stA;e3tD;eMg1nde7XsLuK;f0scEt95;en,se;ge3s9OuK;ft,tA;aVeUlSoQriPuK;eLrK;siI;mmB8ndK;en,igK;en,tD;eBtisier3R;enn5Nmm8nKstA7;kur5WnB2troll5UzentrAY;aKettB0in8K;ff0gt1ng;hrA2nn8;emMm1nLuK;e7Oft0;didASn28;e3p73;dentifizFgnoriAVnKst;formFsze5IterpretAPvestieK;rt1;a0BeYiOoMuK;el4lK;di7I;b0cKerAQff3B;hZk0;eRlQnK;ausgeOgeLterlKzukam0;a6ie6Q;nLwK;iGo96;!o2;he,ko2;ft;lt1ssK;!e;b0iss01rK;aSgeOrs2VuMvorgK;eKi4R;ga5hPrB6trA;mgespB3nterK;gefB1;g7sK;chLtK;elH;ob0;nLusgeK;fu9g7ko2no2sp4B;gezJ;be3eNlMndLtK;!te3;el8le;f0te;lt,ngKt9Vuf8Y;e3t;a17eRiQlMrKutgehei6;atul9Oi9GuK;e2XppiI;aLeichgKiB;eko2;enz0ubK;en,t1;bt,lt,ngD;ae0Yb0Sd0Qeini95f0Mg0Ih0Eko2l0Am08n06p05r03sStPwLzK;ei94i0Qog0wu5;aMes0iGoK;e6Qnn0rK;b0d0f0;c85ehHnn1rA7sB;an,oet76rK;aKet0i7o92unk0;g0u0;a8WchSeRpQtMuK;c70nK;g0k0;and1eMi8PoLriK;ch0tt0;hl0rb0ss0;he3lH;a4ieHroB;h0ss0t7C;aff57eKi7Dl9Oni9No9Mri7;he,i1V;at0echn6SiKu9O;et0ss0;la9QriG;an9Po2uK;e5Qt75;aKe6;c6Kh8Q;aMeLiKte,u5;ng8tt0;g4Ws0;d0ng,ss0uf0;aMeLoKt;b0er5Wlf0;!imge78;bt,lt0n5P;a5eMoLrK;i89uend6C;lt0ss0;b0nueberstP;aMiel,loLor7FuK;eh7Fnd0;g0h0ss0;ehr1Ull0;a4AiKru5;eh0;aIeOli7oMrKu9;aKoB;c5Zuc3T;rKt0;en,g0;!t0;n73usse74;b1e4lt1rant81;a07e01iZlWoSrOuK;eKhr0;g0hKrch4J;l88rK;e,tD;aMeK;igeKue;g7ko2la6sp8S;gt0ss0;erd7WlMrK;derKmiItgeschV;e,n,tD;gt1;ieLoKuecE;g0h0ss1;sse3;elDnK;de30g1;hlOier44rtigbri5stK;geKsi3L;ha4le74no2sK;chKta9;ri7;e3gesc20t1;eKn19s52voris15;lHnd0;i18mpf14n0HrNs6MxK;isLpK;andF;ti7C;eignAf0Bg09h07inner06k04lYmVoeff2MrTsQtPwLzK;aehHiel8wu5;aLi2PoK;g0rb0;e3RrK;b0t4W;ei4;chKo4BtoB;ein8ien1lo6o38reK;ck0;eiKu5;ch8;itt06oK;eglichKrd4O;e,t1;aNeMiLoK;e4GsB;e6tt0;bt0d31g0ichteC;euKg1ss0;te5O;en6TlK;aertDomm;e,n,t1;aeHielt1oK;b0eh8ff0lt0;aKeb0i11riff1;b0eb0ng0;or3Hr0RuK;ell8hr0nd0;dAgag05tK;deckt1f02gZhXlVno2ri6sOwMzK;og0ueK;ndA;ickKo50;eHle;chOpMtK;aKe1Sue9;mm0nd1;a3FrK;a47eche3ic3VoB;eiKi4Flo2B;de;a09ieK;ss;aKie4;eHlt0;a5egenK;gKscXt4G;etrA;al0ViK;el0;ie2V;aLeh0SinKohl0u9;de,g;hl0nK;d1g0;gnAlt0nK;be00dra5fror,gOi2Hpra54sLtraK;f0t;cLetKt0K;zt0;hla4U;eKi3M;bTdSfQgPha4laOno2richt39sLtrKwiGzJ;ag0et0o55;chLet3OtK;elHi4V;l5Zri7;d0ss0;a5ri50;a4TrKueh49;or0;ru5;roBu9;r64zJ;a02eZiXoUrRuK;erfPrK;chKft0;geLraKzJ;ng;ru5scKzJ;hl3U;e3te3;aLeh0i5oKueck50;e1Gh24;eng3Zng0;kumLmiK;niI;enY;en4UskutK;ie3P;battFck4SmonstKnk8u17;ri3R;ieC;beigewGcErKueC;f,stK;elK;le;a2DeSiRlPoNrKucE;aKing8;chKecEn4Cuch1O;!en,te3;et0ykotK;tiI;eibt,iKocki3Fueh3G;eb1tz0;et22ldAn;a22d1Ye1Xf1Mg1Eh18i17k12l0Xm0Wnoe0Ur0Ls05tVvorstSwOzK;eichLiKog0weife4;eRffer1P;neK;!t;ahCiMoKun14;g0rK;b0f0;es1;aLeK;he;nd;eSonRrK;aNeMi7oLuK;e36g0;ff0g0;ff0t0;cLeKge,t;f0gt;ht2V;en,te;ilig8n,t0;aYchPiOp4JtLuK;cht1;aLeh8ri46uenK;de3;eti34nd1;tz0;aef02einRiPloOni42o6rLuldRwoK;er0r1;aenLeibKi7;en,t;kt0;ss1;ed0mpK;ft0;ig0;g0nn0ss1;eOiLuK;f0h2A;chtetDeK;f1t0;!e3;cMiK;teK;n,t0;hn0;tiK;ge3;erke,ueh34;aLeKi32og0;g8ucE;d0s0AuK;eKf0;rn;aLenne3la2Bomm8raeftiK;gt0;eme3m0nntK;en,geK;g7word0;be16getr31mes1Utrug0;aLerrs0EinK;de2H;nLrKupt1N;re3;deH;lt;anQeb0inPlOoNrK;ab0i22ueK;ndAssK;e3t1;nn0;eiQiB;g1n8;g0n1;aSindeRlueQrPuK;erKnd0;chLwoC;rt0;teK;n,t;eit;ge4;!n,t;e9ll0nd1sK;st0;influs14ndN;aue1SeutMiLroK;ht;en0ng0;et;bsichti11nspruK;ch0T;lanciIsi0Rt,u8;e,t;b1Qe1Lg1Jh1Illeingela6n0Upp0Sr0Oss,ttackiIuK;f02sK;bild0fiel1gNmach1SspraMwiLzeK;ichnA;ch,es;ch1;eLiK;ng1;bUfa0XgTlQno2r2CsLtr1UwK;ac03iG;chMeKp28;h0tK;zt;iKlo6ri7;ed0;aLoeK;st;d0uf0;a5eb0liB;li7roB;geOhie4rMtLwK;eis0ies;rat;echterKi16;ha4;bYfUg0LhTko2no2r1VsQtOwLzK;og0wu5;acLoK;rf0;hs0;an,rA;et0;chKe6;lKob0;ag0;a4ob0;aMlJorK;deK;rt;ll0ng0;ot0roB;beitMgumentiK;erK;en,t0;et1;elli0FlaudiI;er0;bot0geNleMtrat1weiK;se;!en;ge;b01fYgVhTkRla15no2r15sMtKwiGzJ;an,rK;ag0et0i7oU;chMeh0p10tK;iKo6;eg0;lo6o6ri7woK;ll0;laKo2uendiK;gt;a4e,oK;b0eU;a5eb0riK;ff0;ng0;aLocE;ht0;hr0ll0ng0;ot0u9;nd0;nt0;ieK;re;ndMussK;erK;te3;erK;e,t0;ber0DgePlLzeichK;ne;ehnLiK;ef;e3t0;!n;b05f04g02ha4l00no2rWsQtOwLzJ;og0;iGoK;rb0;es0;an,rK;ag0et0;chKeh0pYto6;lNniMoLri7;eb0;b0ss0;tt0;ag0o6;i6uK;f0ng0;ss0;mm0;aQehK;nt;eb0o4;lt0;ahr0;roB;ch0;uf0;en"
},{}],37:[function(_dereq_,module,exports){
/* nlp-compromise/efrt v0.0.6
 usage: unpack(myPackedString).has(word)
 by @spencermountain MIT
*/
'use strict';

const BASE = 36;

const seq = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const cache = seq.split('').reduce(function(h, c, i) {
  h[c] = i;
  return h;
}, {});

// 0, 1, 2, ..., A, B, C, ..., 00, 01, ... AA, AB, AC, ..., AAA, AAB, ...
const toAlphaCode = function(n) {
  if (seq[n] !== undefined) {
    return seq[n];
  }
  let places = 1;
  let range = BASE;
  let s = '';

  for (; n >= range; n -= range, places++, range *= BASE) {
  }
  while (places--) {
    const d = n % BASE;
    s = String.fromCharCode((d < 10 ? 48 : 55) + d) + s;
    n = (n - d) / BASE;
  }
  return s;
};


const fromAlphaCode = function(s) {
  if (cache[s] !== undefined) {
    return cache[s];
  }
  let n = 0;
  let places = 1;
  let range = BASE;
  let pow = 1;

  for (; places < s.length; n += range, places++, range *= BASE) {
  }
  for (let i = s.length - 1; i >= 0; i--, pow *= BASE) {
    let d = s.charCodeAt(i) - 48;
    if (d > 10) {
      d -= 7;
    }
    n += d * pow;
  }
  return n;
};

var encoding = {
  toAlphaCode: toAlphaCode,
  fromAlphaCode: fromAlphaCode
};

//the symbols are at the top of the array.
var symbols = function(t) {
  //... process these lines
  const reSymbol = new RegExp('([0-9A-Z]+):([0-9A-Z]+)');
  for(let i = 0; i < t.nodes.length; i++) {
    const m = reSymbol.exec(t.nodes[i]);
    if (!m) {
      t.symCount = i;
      break;
    }
    t.syms[encoding.fromAlphaCode(m[1])] = encoding.fromAlphaCode(m[2]);
  }
  //remove from main node list
  t.nodes = t.nodes.slice(t.symCount, t.nodes.length);
};

//are we on the right path with this string?
var prefix = function(str, want) {
  //allow perfect equals
  if (str === want) {
    return true;
  }
  //compare lengths
  let len = str.length;
  if (len >= want.length) {
    return false;
  }
  //quick slice
  if (len === 1) {
    return str === want[0];
  }
  return want.slice(0, len) === str;
};

//spin-out all words from this trie
var unravel = function(trie) {
  let all = {};
  const crawl = function(index, pref) {
    let node = trie.nodes[index];
    if (node[0] === '!') {
      all[pref] = true;
      node = node.slice(1); //ok, we tried. remove it.
    }
    let matches = node.split(/([A-Z0-9,]+)/g);
    for (let i = 0; i < matches.length; i += 2) {
      let str = matches[i];
      let ref = matches[i + 1];
      if (!str) {
        continue;
      }

      let have = pref + str;
      //branch's end
      if (ref === ',' || ref === undefined) {
        all[have] = true;
        continue;
      }
      let newIndex = trie.indexFromRef(ref, index);
      crawl(newIndex, have);
    }
  };
  crawl(0, '');
  return all;
};

const methods = {
  // Return largest matching string in the dictionary (or '')
  has: function(want) {
    //fail-fast
    if (!want) {
      return false;
    }
    //then, try cache-lookup
    if (this._cache) {
      return this._cache[want] || false;
    }
    let self = this;
    const crawl = function(index, prefix$$1) {
      let node = self.nodes[index];
      //the '!' means a prefix-alone is a good match
      if (node[0] === '!') {
        //try to match the prefix (the last branch)
        if (prefix$$1 === want) {
          return true;
        }
        node = node.slice(1); //ok, we tried. remove it.
      }
      //each possible match on this line is something like 'me,me2,me4'.
      //try each one
      const matches = node.split(/([A-Z0-9,]+)/g);
      for (let i = 0; i < matches.length; i += 2) {
        const str = matches[i];
        const ref = matches[i + 1];
        if (!str) {
          continue;
        }
        const have = prefix$$1 + str;
        //we're at the branch's end, so try to match it
        if (ref === ',' || ref === undefined) {
          if (have === want) {
            return true;
          }
          continue;
        }
        //ok, not a match.
        //well, should we keep going on this branch?
        //if we do, we ignore all the others here.
        if (prefix(have, want)) {
          index = self.indexFromRef(ref, index);
          return crawl(index, have);
        }
        //nah, lets try the next branch..
        continue;
      }

      return false;
    };
    return crawl(0, '');
  },

  // References are either absolute (symbol) or relative (1 - based)
  indexFromRef: function(ref, index) {
    const dnode = encoding.fromAlphaCode(ref);
    if (dnode < this.symCount) {
      return this.syms[dnode];
    }
    return index + dnode + 1 - this.symCount;
  },

  toArray: function() {
    return Object.keys(this.toObject());
  },

  toObject: function() {
    if (this._cache) {
      return this._cache;
    }
    return unravel(this);
  },

  cache: function() {
    this._cache = unravel(this);
    this.nodes = null;
    this.syms = null;
  }
};
var methods_1 = methods;

//PackedTrie - Trie traversal of the Trie packed-string representation.
const PackedTrie = function(str) {
  this.nodes = str.split(';'); //that's all ;)!
  this.syms = [];
  this.symCount = 0;
  this._cache = null;
  //process symbols, if they have them
  if (str.match(':')) {
    symbols(this);
  }
};

Object.keys(methods_1).forEach(function(k) {
  PackedTrie.prototype[k] = methods_1[k];
});

var ptrie = PackedTrie;

var index = function(str) {
  return new ptrie(str);
};

module.exports = index;

},{}],38:[function(_dereq_,module,exports){
'use strict';
const unpack = _dereq_('./efrt-unpack');

//order doesn't (shouldn't) matter here
const data = {
  adjectives: [_dereq_('./_packed/_adjectives'), 'Adjektiv'],
  adverbs: [_dereq_('./_packed/_adverbs'), 'Adverb'],
  auxiliaries: [_dereq_('./_packed/_auxiliaries'), 'Hilfsverb'],
  conjunctions: [_dereq_('./_packed/_conjunctions'), 'Bindewort'],
  determiners: [_dereq_('./_packed/_determiners'), 'Determinativ'],
  femaleNouns: [_dereq_('./_packed/_femaleNouns'), 'FemininSubst'],
  infinitives: [_dereq_('./_packed/_infinitives'), 'Infinitiv'],
  maleNouns: [_dereq_('./_packed/_maleNouns'), 'MannlichSubst'],
  neuterNouns: [_dereq_('./_packed/_neuterNouns'), 'SachlichSubst'],
  nouns: [_dereq_('./_packed/_nouns'), 'Substantiv'],
  prepositions: [_dereq_('./_packed/_prepositions'), 'Praposition'],
  pronouns: [_dereq_('./_packed/_pronouns'), 'Pronomen'],
  values: [_dereq_('./_packed/_values'), 'Zahl'],
  verbs: [_dereq_('./_packed/_verbs'), 'Verb'],
};
Object.keys(data).forEach((k) => {
  let tag = data[k][1];
  data[k] = {
    obj: unpack(data[k][0]).toObject(),
    tag: tag
  };
});

module.exports = data;

},{"./_packed/_adjectives":23,"./_packed/_adverbs":24,"./_packed/_auxiliaries":25,"./_packed/_conjunctions":26,"./_packed/_determiners":27,"./_packed/_femaleNouns":28,"./_packed/_infinitives":29,"./_packed/_maleNouns":30,"./_packed/_neuterNouns":31,"./_packed/_nouns":32,"./_packed/_prepositions":33,"./_packed/_pronouns":34,"./_packed/_values":35,"./_packed/_verbs":36,"./efrt-unpack":37}],39:[function(_dereq_,module,exports){
'use strict';

const suffixTest = (t, list) => {
  let len = t.normal.length;
  for(let i = 1; i < list.length; i++) {
    if (t.normal.length <= i) {
      return false;
    }
    let str = t.normal.substr(len - i, len - 1);
    if (list[i][str] !== undefined) {
      return true;
    }
  }
  return false;
};
module.exports = suffixTest;

},{}],40:[function(_dereq_,module,exports){
'use strict';
//if we have no tags, make it a noun
const nounFallback = (ts) => {
  ts.terms.forEach((t) => {
    if (Object.keys(t.tags).length === 0) {
      t.tag('Substantiv', 'noun-fallback');
    }
  });
  return ts;
};
module.exports = nounFallback;

},{}],41:[function(_dereq_,module,exports){
module.exports=[
  {},
  {},
  {
    "er": 1,
    "he": 1,
    "ch": 1,
    "en": 1,
    "es": 1,
    "ig": 1,
    "de": 1,
    "ge": 1,
    "ne": 1,
    "nd": 1,
    "em": 1,
    "le": 1,
    "ar": 1,
    "os": 1,
    "re": 1,
    "ll": 1,
    "al": 1,
    "iv": 1,
    "it": 1,
    "el": 1,
    "me": 1,
    "se": 1,
    "eu": 1,
    "il": 1,
    "mm": 1,
    "au": 1,
    "rm": 1,
    "rz": 1,
    "ff": 1,
    "eh": 1,
    "xe": 1,
    "ue": 1
  },
  {
    "ive": 1,
    "sam": 1,
    "ein": 1,
    "nah": 1
  },
  {
    "frei": 1,
    "nehm": 1,
    "fair": 1,
    "klug": 1
  },
  {
    "freie": 1,
    "stark": 1
  }
]

},{}],42:[function(_dereq_,module,exports){
module.exports=[
  {},
  {},
  {
    "ng": 1,
    "en": 1,
    "on": 1,
    "it": 1,
    "ft": 1,
    "ie": 1,
    "ik": 1,
    "et": 1,
    "nz": 1,
    "he": 1,
    "ne": 1,
    "se": 1,
    "be": 1,
    "ei": 1,
    "ur": 1,
    "pe": 1,
    "ve": 1,
    "dt": 1,
    "ra": 1,
    "ta": 1,
    "iz": 1,
    "su": 1,
    "dp": 1,
    "pd": 1,
    "ty": 1,
    "pg": 1,
    "ap": 1,
    "eu": 1,
    "fa": 1,
    "cd": 1,
    "ga": 1,
    "vs": 1
  },
  {
    "ahl": 1,
    "eln": 1,
    "uld": 1,
    "cdu": 1,
    "ddr": 1,
    "rid": 1,
    "poe": 1,
    "not": 1
  },
  {
    "bank": 1,
    "form": 1,
    "reue": 1
  },
  {
    "front": 1,
    "othek": 1
  },
  {
    "enität": 1
  }
]

},{}],43:[function(_dereq_,module,exports){
module.exports=[
  {},
  {},
  {
    "er": 1,
    "rn": 1,
    "ch": 1,
    "ag": 1,
    "rs": 1,
    "ss": 1,
    "tz": 1,
    "es": 1,
    "us": 1,
    "kt": 1,
    "at": 1,
    "nd": 1,
    "nn": 1,
    "el": 1,
    "or": 1,
    "ef": 1,
    "st": 1,
    "rt": 1,
    "ug": 1,
    "an": 1,
    "rd": 1,
    "ll": 1,
    "eg": 1,
    "ck": 1,
    "il": 1,
    "uf": 1,
    "au": 1,
    "ar": 1,
    "ff": 1,
    "tt": 1,
    "ls": 1,
    "gs": 1,
    "ds": 1,
    "fs": 1,
    "ub": 1,
    "fe": 1,
    "ks": 1,
    "ed": 1,
    "bs": 1,
    "pf": 1,
    "ic": 1,
    "rf": 1,
    "hs": 1,
    "lf": 1,
    "im": 1,
    "am": 1,
    "ai": 1,
    "ki": 1,
    "ex": 1,
    "ak": 1,
    "ps": 1,
    "ph": 1,
    "ir": 1,
    "af": 1,
    "rb": 1,
    "lm": 1,
    "rz": 1,
    "ri": 1,
    "li": 1,
    "gh": 1,
    "oo": 1,
    "og": 1,
    "ob": 1,
    "si": 1,
    "eo": 1,
    "do": 1,
    "ni": 1,
    "id": 1,
    "pp": 1,
    "so": 1,
    "hm": 1,
    "ac": 1,
    "ud": 1,
    "kw": 1,
    "di": 1,
    "ax": 1,
    "mi": 1,
    "mp": 1,
    "ix": 1,
    "wf": 1,
    "no": 1,
    "hi": 1
  },
  {
    "hof": 1,
    "eur": 1,
    "ieb": 1,
    "ohn": 1,
    "eiz": 1,
    "ama": 1,
    "anc": 1,
    "ctu": 1,
    "que": 1,
    "imm": 1,
    "arl": 1,
    "ony": 1,
    "abu": 1
  },
  {
    "stab": 1,
    "text": 1,
    "herr": 1,
    "keln": 1,
    "arzt": 1,
    "ingo": 1
  },
  {
    "schuh": 1,
    "multi": 1
  }
]

},{}],44:[function(_dereq_,module,exports){
module.exports=[
  {},
  {},
  {
    "um": 1,
    "ns": 1,
    "ts": 1,
    "al": 1,
    "ms": 1,
    "rg": 1,
    "as": 1,
    "ld": 1,
    "rk": 1,
    "os": 1,
    "to": 1,
    "ut": 1,
    "ka": 1,
    "ia": 1,
    "ad": 1,
    "em": 1,
    "io": 1,
    "ot": 1,
    "go": 1,
    "pt": 1,
    "pa": 1,
    "da": 1,
    "iv": 1,
    "lz": 1,
    "ro": 1,
    "ko": 1,
    "lo": 1,
    "ol": 1,
    "po": 1,
    "yl": 1,
    "ow": 1,
    "ux": 1
  },
  {
    "amt": 1,
    "awa": 1,
    "pur": 1
  },
  {
    "zeug": 1,
    "heim": 1,
    "lied": 1,
    "dorf": 1,
    "scha": 1,
    "orps": 1
  },
  {
    "gramm": 1,
    "werks": 1,
    "korea": 1
  },
  {
    "bafoeg": 1,
    "mbabwe": 1,
    "schiff": 1
  }
]

},{}],45:[function(_dereq_,module,exports){
module.exports=[
  {},
  {},
  {
    "ng": 1,
    "on": 1,
    "rn": 1,
    "it": 1,
    "el": 1,
    "in": 1,
    "rs": 1,
    "is": 1,
    "ns": 1,
    "us": 1,
    "ie": 1,
    "se": 1,
    "ik": 1,
    "tz": 1,
    "um": 1,
    "ts": 1,
    "an": 1,
    "ag": 1,
    "nz": 1,
    "nn": 1,
    "ck": 1,
    "at": 1,
    "ls": 1,
    "as": 1,
    "au": 1,
    "ur": 1,
    "or": 1,
    "rg": 1,
    "ld": 1,
    "ss": 1,
    "ef": 1,
    "ms": 1,
    "ke": 1,
    "pe": 1,
    "al": 1
  }
]

},{}],46:[function(_dereq_,module,exports){
module.exports=[
  {},
  {},
  {
    "rt": 1,
    "et": 1,
    "gt": 1,
    "lt": 1,
    "te": 1,
    "ht": 1,
    "st": 1,
    "kt": 1,
    "nt": 1,
    "zt": 1,
    "ft": 1,
    "bt": 1,
    "mt": 1,
    "ut": 1,
    "be": 1,
    "fe": 1,
    "pt": 1,
    "ss": 1,
    "og": 1,
    "dt": 1,
    "ng": 1,
    "at": 1,
    "ke": 1,
    "ag": 1,
    "ug": 1,
    "ah": 1,
    "or": 1
  },
  {
    "eln": 1,
    "itt": 1,
    "ieb": 1,
    "gab": 1,
    "tze": 1,
    "ief": 1,
    "ern": 1,
    "tan": 1,
    "arf": 1,
    "hob": 1,
    "kam": 1,
    "arb": 1,
    "ann": 1,
    "ieg": 1,
    "bot": 1,
    "lud": 1
  },
  {
    "nahm": 1,
    "wies": 1,
    "traf": 1,
    "fiel": 1,
    "fuhr": 1,
    "fahl": 1
  },
  {},
  {
    "schied": 1
  }
]

},{}],47:[function(_dereq_,module,exports){
'use strict';
//basic POS-tags (gender done afterwards)
const patterns = {
  adjectives: [_dereq_('./patterns/adjectives'), 'Adjektiv'],
  nouns: [_dereq_('./patterns/nouns'), 'Substantiv'],
  verbs: [_dereq_('./patterns/verbs'), 'Verb'],
};

const testSuffixes = (t, list) => {
  let len = t.normal.length;
  for(let i = 1; i < list.length; i++) {
    if (t.normal.length <= i) {
      return false;
    }
    let str = t.normal.substr(len - i, len - 1);
    if (list[i][str] !== undefined) {
      return true;
    }
  }
  return false;
};
//
const suffixStep = (ts) => {
  const reason = 'suffix-match';
  const keys = Object.keys(patterns);
  ts.terms.forEach((t) => {
    //skip already-tagged terms
    if (Object.keys(t.tags).length > 0) {
      return;
    }
    for(let i = 0; i < keys.length; i++) {
      if (testSuffixes(t, patterns[keys[i]][0]) === true) {
        t.tag(patterns[keys[i]][1], reason);
        return;
      }
    }
  });
  return ts;
};
module.exports = suffixStep;

},{"./patterns/adjectives":41,"./patterns/nouns":45,"./patterns/verbs":46}],48:[function(_dereq_,module,exports){
module.exports = {
  Substantiv: { //noun
    is: [],
    enemy: ['Verb', 'Adjektiv', 'Adverb', 'Artikel', 'Bindewort', 'Praposition']
  },
  MannlichSubst: { //masculine noun
    is: ['Substantiv'],
    enemy: ['Feminin', 'Sachlich']
  },
  FemininSubst: { //feminine noun
    is: ['Substantiv'],
    enemy: ['Mannlich', 'Sachlich']
  },
  SachlichSubst: { //neuter noun
    is: ['Substantiv'],
    enemy: []
  },


  Pronomen: { //pronoun
    is: ['Substantiv'],
    enemy: []
  },
  Determinativ: { //determiner
    is: [],
    enemy: []
  },

  Zahl: { //value
    is: [],
    enemy: ['Substantiv', 'Adjektiv', 'Adverb', 'Artikel', 'Bindewort', 'Praposition']
  },

  Verb: { //verb
    is: [],
    enemy: ['Substantiv', 'Adjektiv', 'Adverb', 'Artikel', 'Bindewort', 'Praposition']
  },
  Infinitiv: { //infinitive verb
    is: ['Verb'],
    enemy: []
  },
  Hilfsverb: { //Auxiliary Verb
    is: [],
    enemy: ['Substantiv', 'Adjektiv', 'Adverb', 'Artikel', 'Bindewort', 'Praposition']
  },

  Adjektiv: { //adjective
    is: [],
    enemy: ['Substantiv', 'Verb', 'Adverb', 'Artikel', 'Bindewort', 'Praposition']
  },
  Adverb: { //adverb
    is: [],
    enemy: ['Substantiv', 'Verb', 'Adjektiv', 'Artikel', 'Bindewort', 'Praposition']
  },
  Artikel: { //article
    is: [],
    enemy: ['Substantiv', 'Verb', 'Adjektiv', 'Adverb', 'Bindewort', 'Praposition']
  },
  Bindewort: { //conjunction
    is: [],
    enemy: ['Substantiv', 'Verb', 'Adjektiv', 'Adverb', 'Artikel', 'Praposition']
  },
  Praposition: { //preposition
    is: [],
    enemy: ['Substantiv', 'Verb', 'Adjektiv', 'Adverb', 'Artikel', 'Bindewort']
  },
  Url: {
    is: [],
    enemy: [],
  },
};

},{}],49:[function(_dereq_,module,exports){
'use strict';
const fns = _dereq_('./paths').fns;
const build_whitespace = _dereq_('./whitespace');
const makeUID = _dereq_('./makeUID');
//normalization
const normalize = _dereq_('./methods/normalize').normalize;

const Term = function(str) {
  this._text = fns.ensureString(str);
  this.tags = {};
  //seperate whitespace from the text
  let parsed = build_whitespace(this._text);
  this.whitespace = parsed.whitespace;
  this._text = parsed.text;
  this.parent = null;
  this.silent_term = '';
  this.lumped = false;
  //normalize the _text
  this.normal = normalize(this._text);
  //has this term been modified
  this.dirty = false;
  //make a unique id for this term
  this.uid = makeUID(this.normal);

  //getters/setters
  Object.defineProperty(this, 'text', {
    get: function() {
      return this._text;
    },
    set: function(txt) {
      txt = txt || '';
      this._text = txt.trim();
      this.dirty = true;
      if (this._text !== txt) {
        this.whitespace = build_whitespace(txt);
      }
      this.normalize();
    }
  });
  //bit faster than .constructor.name or w/e
  Object.defineProperty(this, 'isA', {
    get: function() {
      return 'Term';
    }
  });
};
Term.prototype.normalize = function() {
  return normalize(this.text);
};

_dereq_('./methods/tag')(Term);
_dereq_('./methods/out')(Term);
_dereq_('./methods/case')(Term);
_dereq_('./methods/punctuation')(Term);
module.exports = Term;

},{"./makeUID":50,"./methods/case":51,"./methods/normalize":52,"./methods/out":56,"./methods/punctuation":58,"./methods/tag":60,"./paths":63,"./whitespace":64}],50:[function(_dereq_,module,exports){
'use strict';
//this is a not-well-thought-out way to reduce our dependence on `object===object` reference stuff
//generates a unique id for this term
//may need to change when the term really-transforms? not sure.
const uid = (str) => {
  let nums = '';
  for(let i = 0; i < 5; i++) {
    nums += parseInt(Math.random() * 9, 10);
  }
  return str + '-' + nums;
};
module.exports = uid;

},{}],51:[function(_dereq_,module,exports){
'use strict';

const addMethods = (Term) => {

  const methods = {
    toUpperCase: function () {
      this.text = this.text.toUpperCase();
      this.tag('#UpperCase', 'toUpperCase');
      return this;
    },
    toLowerCase: function () {
      this.text = this.text.toLowerCase();
      this.unTag('#TitleCase');
      this.unTag('#UpperCase');
      return this;
    },
    toTitleCase: function () {
      this.text = this.text.replace(/^[a-z]/, (x) => x.toUpperCase());
      this.tag('#TitleCase', 'toTitleCase');
      return this;
    },
    //(camelCase() is handled in `./terms` )

    /** is it titlecased because it deserves it? Like a person's name? */
    needsTitleCase: function() {
      const titleCases = [
        'Person',
        'Place',
        'Organization',
        'Acronym',
        'UpperCase',
        'Currency',
        'RomanNumeral',
        'Month',
        'WeekDay',
        'Holiday',
        'Demonym',
      ];
      for(let i = 0; i < titleCases.length; i++) {
        if (this.tags[titleCases[i]]) {
          return true;
        }
      }
      //specific words that keep their titlecase
      //https://en.wikipedia.org/wiki/Capitonym
      const irregulars = [
        'i',
        'god',
        'allah',
      ];
      for(let i = 0; i < irregulars.length; i++) {
        if (this.normal === irregulars[i]) {
          return true;
        }
      }
      return false;
    }
  };
  //hook them into result.proto
  Object.keys(methods).forEach((k) => {
    Term.prototype[k] = methods[k];
  });
  return Term;
};

module.exports = addMethods;

},{}],52:[function(_dereq_,module,exports){
'use strict';
const killUnicode = _dereq_('./unicode');
const isAcronym = _dereq_('./isAcronym');


//some basic operations on a string to reduce noise
exports.normalize = function(str) {
  str = str || '';
  str = str.toLowerCase();
  str = str.trim();
  let original = str;
  //(very) rough asci transliteration -  bjŏrk -> bjork
  str = killUnicode(str);
  //hashtags, atmentions
  str = str.replace(/^[#@]/, '');
  // coerce single curly quotes
  str = str.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]+/g, '\'');
  // coerce double curly quotes
  str = str.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036"]+/g, '');
  //coerce unicode elipses
  str = str.replace(/\u2026/g, '...');
  //en-dash
  str = str.replace(/\u2013/g, '-');

  //strip leading & trailing grammatical punctuation
  if (/^[:;]/.test(str) === false) {
    str = str.replace(/\.{3,}$/g, '');
    str = str.replace(/['",\.!:;\?\)]$/g, '');
    str = str.replace(/^['"\(]/g, '');
  }
  //oh shucks,
  if (str === '') {
    str = original;
  }
  return str;
};

exports.addNormal = function (term) {
  let str = term._text || '';
  str = exports.normalize(str);
  //compact acronyms
  if (isAcronym(term._text)) {
    str = str.replace(/\./g, '');
  }
  //nice-numbers
  str = str.replace(/([0-9]),([0-9])/g, '$1$2');
  term.normal = str;
};


// console.log(normalize('Dr. V Cooper'));

},{"./isAcronym":53,"./unicode":54}],53:[function(_dereq_,module,exports){
'use strict';
//regs -
const periodAcronym = /([A-Z]\.)+[A-Z]?$/;
const oneLetterAcronym = /^[A-Z]\.$/;
const noPeriodAcronym = /[A-Z]{3}$/;

/** does it appear to be an acronym, like FBI or M.L.B. */
const isAcronym = function (str) {
  //like N.D.A
  if (periodAcronym.test(str) === true) {
    return true;
  }
  //like 'F.'
  if (oneLetterAcronym.test(str) === true) {
    return true;
  }
  //like NDA
  if (noPeriodAcronym.test(str) === true) {
    return true;
  }
  return false;
};
module.exports = isAcronym;

},{}],54:[function(_dereq_,module,exports){
const noUmlaut = (str) => {
  // ä, ö and ü, ß
  str = str.replace(/ä/u, 'ae');
  str = str.replace(/ö/u, 'oe');
  str = str.replace(/ü/u, 'ue');
  str = str.replace(/ß/u, 'ss');
  return str;
};
module.exports = noUmlaut;

},{}],55:[function(_dereq_,module,exports){
'use strict';
const fns = _dereq_('../../paths').fns;
const colors = {
  'Person': '#6393b9',
  'Pronoun': '#81acce',
  'Noun': 'steelblue',
  'Verb': 'palevioletred',
  'Adverb': '#f39c73',
  'Adjective': '#b3d3c6',
  'Determiner': '#d3c0b3',
  'Preposition': '#9794a8',
  'Conjunction': '#c8c9cf',
  'Value': 'palegoldenrod',
  'Expression': '#b3d3c6'
};

//a nicer logger for the client-side
const clientSide = (t) => {
  let color = 'silver';
  let tags = Object.keys(t.tags);
  for(let i = 0; i < tags.length; i++) {
    if (colors[tags[i]]) {
      color = colors[tags[i]];
      break;
    }
  }
  let word = fns.leftPad(t.text, 12);
  word += ' ' + tags;
  console.log('%c ' + word, 'color: ' + color);
};
module.exports = clientSide;

},{"../../paths":63}],56:[function(_dereq_,module,exports){
'use strict';
const renderHtml = _dereq_('./renderHtml');
const fns = _dereq_('../../paths').fns;
const clientDebug = _dereq_('./client');

const serverDebug = function(t) {
  let tags = Object.keys(t.tags).map((tag) => {
    return fns.printTag(tag);
  }).join(', ');
  let word = t.text;
  word = '\'' + fns.yellow(word || '-') + '\'';
  let silent = '';
  if (t.silent_term) {
    silent = '[' + t.silent_term + ']';
  }
  word = fns.leftPad(word, 25);
  word += fns.leftPad(silent, 5);
  console.log('   ' + word + '   ' + '     - ' + tags);
};

const methods = {
  /** a pixel-perfect reproduction of the input, with whitespace preserved */
  text: function(r) {
    return r.whitespace.before + r._text + r.whitespace.after;
  },
  /** a lowercased, punctuation-cleaned, whitespace-trimmed version of the word */
  normal: function(r) {
    return r.normal;
  },
  /** even-more normalized than normal */
  root: function(r) {
    return r.root || r.normal;
  },
  /** the &encoded term in a span element, with POS as classNames */
  html: function(r) {
    return renderHtml(r);
  },
  /** a simplified response for Part-of-Speech tagging*/
  tags: function(r) {
    return {
      text: r.text,
      normal: r.normal,
      tags: Object.keys(r.tags)
    };
  },
  /** check-print information for the console */
  debug: function(t) {
    if (typeof window !== 'undefined') {
      clientDebug(t);
    } else {
      serverDebug(t);
    }
  }
};

const addMethods = (Term) => {
  //hook them into result.proto
  Term.prototype.out = function(fn) {
    if (!methods[fn]) {
      fn = 'text';
    }
    return methods[fn](this);
  };
  return Term;
};

module.exports = addMethods;

},{"../../paths":63,"./client":55,"./renderHtml":57}],57:[function(_dereq_,module,exports){
'use strict';
//turn xml special characters into apersand-encoding.
//i'm not sure this is perfectly safe.
const escapeHtml = (s) => {
  const HTML_CHAR_MAP = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    '\'': '&#39;',
    ' ': '&nbsp;'
  };
  return s.replace(/[<>&"' ]/g, function(ch) {
    return HTML_CHAR_MAP[ch];
  });
};

//remove html elements already in the text
//not tested!
//http://stackoverflow.com/questions/295566/sanitize-rewrite-html-on-the-client-side
const sanitize = (html) => {
  const tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
  const tagOrComment = new RegExp(
    '<(?:'
    // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
    // Regular name
    + '|/?[a-z]'
    + tagBody
    + ')>',
    'gi');
  let oldHtml;
  do {
    oldHtml = html;
    html = html.replace(tagOrComment, '');
  } while (html !== oldHtml);
  return html.replace(/</g, '&lt;');
};

//turn the term into ~properly~ formatted html
const renderHtml = function(t) {
  let classes = Object.keys(t.tags).filter((tag) => tag !== 'Term');
  classes = classes.map(c => 'nl-' + c);
  classes = classes.join(' ');
  let text = sanitize(t.text);
  text = escapeHtml(text);
  let el = '<span class="' + classes + '">' + text + '</span>';
  return escapeHtml(t.whitespace.before) + el + escapeHtml(t.whitespace.after);
};

module.exports = renderHtml;

},{}],58:[function(_dereq_,module,exports){
'use strict';
const endPunct = /([a-z])([,:;\/.(\.\.\.)\!\?]+)$/i;
const addMethods = (Term) => {

  const methods = {
    /** the punctuation at the end of this term*/
    endPunctuation: function() {
      let m = this.text.match(endPunct);
      if (m) {
        const allowed = {
          ',': 'comma',
          ':': 'colon',
          ';': 'semicolon',
          '.': 'period',
          '...': 'elipses',
          '!': 'exclamation',
          '?': 'question'
        };
        if (allowed[m[2]] !== undefined) {
          return m[2];
        }
      }
      return null;
    },
    setPunctuation: function(punct) {
      this.killPunctuation();
      this.text += punct;
      return this;
    },

    /** check if the term ends with a comma */
    hasComma: function () {
      if (this.endPunctuation() === 'comma') {
        return true;
      }
      return false;
    },

    killPunctuation: function () {
      this.text = this._text.replace(endPunct, '$1');
      return this;
    },
  };
  //hook them into result.proto
  Object.keys(methods).forEach((k) => {
    Term.prototype[k] = methods[k];
  });
  return Term;
};

module.exports = addMethods;

},{}],59:[function(_dereq_,module,exports){
'use strict';
const path = _dereq_('../../paths');
const tagset = path.tags;

//recursively-check compatibility of this tag and term
const canBe = function(term, tag) {
  //fail-fast
  if (tagset[tag] === undefined) {
    return true;
  }
  //loop through tag's contradictory tags
  let enemies = tagset[tag].enemy || [];
  for (let i = 0; i < enemies.length; i++) {
    if (term.tags[enemies[i]] === true) {
      return false;
    }
  }
  if (tagset[tag].is !== undefined) {
    return canBe(term, tagset[tag].is); //recursive
  }
  return true;
};

module.exports = canBe;

},{"../../paths":63}],60:[function(_dereq_,module,exports){
'use strict';
const setTag = _dereq_('./setTag');
const unTag = _dereq_('./unTag');
const canBe = _dereq_('./canBe');

//symbols used in sequential taggers which mean 'do nothing'
//.tag('#Person #Place . #City')
const ignore = {
  '.': true
};
const addMethods = (Term) => {

  const methods = {
    /** set the term as this part-of-speech */
    tag: function(tag, reason) {
      if (ignore[tag] !== true) {
        setTag(this, tag, reason);
      }
    },
    /** remove this part-of-speech from the term*/
    unTag: function(tag, reason) {
      if (ignore[tag] !== true) {
        unTag(this, tag, reason);
      }
    },
    /** is this tag compatible with this word */
    canBe: function (tag) {
      tag = tag || '';
      if (typeof tag === 'string') {
        //everything can be '.'
        if (ignore[tag] === true) {
          return true;
        }
        tag = tag.replace(/^#/, '');
      }
      return canBe(this, tag);
    }
  };

  //hook them into term.prototype
  Object.keys(methods).forEach((k) => {
    Term.prototype[k] = methods[k];
  });
  return Term;
};

module.exports = addMethods;

},{"./canBe":59,"./setTag":61,"./unTag":62}],61:[function(_dereq_,module,exports){
'use strict';
//set a term as a particular Part-of-speech
const path = _dereq_('../../paths');
const log = path.log;
const fns = path.fns;
const unTag = _dereq_('./unTag');
// const tagset = path.tags;
const tagset = _dereq_('../../../tagset');

const putTag = (term, tag, reason) => {
  tag = tag.replace(/^#/, '');
  //already got this
  if (term.tags[tag] === true) {
    return;
  }
  term.tags[tag] = true;
  log.tag(term, tag, reason);

  //extra logic per-each POS
  if (tagset[tag]) {
    //drop any conflicting tags
    let enemies = tagset[tag].enemy;
    for (let i = 0; i < enemies.length; i++) {
      if (term.tags[enemies[i]] === true) {
        unTag(term, enemies[i], reason);
      }
    }
    //apply implicit tags
    if (tagset[tag].is) {
      tagset[tag].is.forEach((doAlso) => {
        if (term.tags[doAlso] !== true) {
          putTag(term, doAlso, ' --> ' + tag); //recursive
        }
      });
    }
  }
};

//give term this tag
const wrap = function (term, tag, reason) {
  if (!term || !tag) {
    return;
  }
  //handle multiple tags
  if (fns.isArray(tag)) {
    tag.forEach((t) => putTag(term, t, reason)); //recursive
    return;
  }
  putTag(term, tag, reason);
  //add 'extra' tag (for some special tags)
  if (tagset[tag] && tagset[tag].also !== undefined) {
    putTag(term, tagset[tag].also, reason);
  }
};

module.exports = wrap;

},{"../../../tagset":48,"../../paths":63,"./unTag":62}],62:[function(_dereq_,module,exports){
'use strict';
//set a term as a particular Part-of-speech
const path = _dereq_('../../paths');
const log = path.log;
const tagset = path.tags;

//remove a tag from a term
const unTag = (term, tag, reason) => {
  if (term.tags[tag]) {
    log.unTag(term, tag, reason);
    delete term.tags[tag];

    //delete downstream tags too
    if (tagset[tag]) {
      let also = tagset[tag].is;
      for(let i = 0; i < also.length; i++) {
        unTag(term, also[i], ' - -   - ');
      }
    }
  }
};

const wrap = (term, tag, reason) => {
  if (!term || !tag) {
    return;
  }
  //support '*' flag - remove all-tags
  if (tag === '*') {
    term.tags = {};
    return;
  }
  //remove this tag
  unTag(term, tag, reason);
  return;
};
module.exports = wrap;

},{"../../paths":63}],63:[function(_dereq_,module,exports){
module.exports = {
  fns: _dereq_('../fns'),
  log: _dereq_('../log'),
  tags: _dereq_('../tagset')
};

},{"../fns":2,"../log":5,"../tagset":48}],64:[function(_dereq_,module,exports){
'use strict';
//punctuation regs-
const before = /^(\s|-+|\.\.+)+/;
const minusNumber = /^( *)-(\$|€|¥|£)?([0-9])/;
const after = /(\s+|-+|\.\.+)$/;

//seperate the 'meat' from the trailing/leading whitespace.
//works in concert with ./src/result/tokenize.js
const build_whitespace = (str) => {
  let whitespace = {
    before: '',
    after: ''
  };
  //get before punctuation/whitespace
  //mangle 'far - fetched', but don't mangle '-2'
  let m = str.match(minusNumber);
  if (m !== null) {
    whitespace.before = m[1];
    str = str.replace(/^ */, '');
  } else {
    m = str.match(before);
    if (m !== null) {
      whitespace.before = str.match(before)[0];
      str = str.replace(before, '');
    }
  }
  //get after punctuation/whitespace
  m = str.match(after);
  if (m !== null) {
    str = str.replace(after, '');
    whitespace.after = m[0];
  }
  return {
    whitespace: whitespace,
    text: str
  };
};
module.exports = build_whitespace;

},{}],65:[function(_dereq_,module,exports){
'use strict';
const Term = _dereq_('../term');
const hasHyphen = /^([a-z]+)(-)([a-z0-9].*)/i;
const wordlike = /\S/;

const notWord = {
  '-': true,
  '–': true,
  '--': true,
  '...': true,
};

//turn a string into an array of terms (naiive for now, lumped later)
const fromString = function (str) {
  let result = [];
  let arr = [];
  //start with a naiive split
  str = str || '';
  if (typeof str === 'number') {
    str = '' + str;
  }
  const firstSplit = str.split(/(\S+)/);
  for(let i = 0; i < firstSplit.length; i++) {
    const word = firstSplit[i];
    if (hasHyphen.test(word) === true) {
      //support multiple-hyphenated-terms
      const hyphens = word.split('-');
      for(let o = 0; o < hyphens.length; o++) {
        if (o === hyphens.length - 1) {
          arr.push(hyphens[o]);
        } else {
          arr.push(hyphens[o] + '-');
        }
      }
    } else {
      arr.push(word);
    }
  }
  //greedy merge whitespace+arr to the right
  let carry = '';
  for (let i = 0; i < arr.length; i++) {
    //if it's more than a whitespace
    if (wordlike.test(arr[i]) === true && notWord[arr[i]] === undefined) {
      result.push(carry + arr[i]);
      carry = '';
    } else {
      carry += arr[i];
    }
  }
  //handle last one
  if (carry && result.length > 0) {
    result[result.length - 1] += carry; //put it on the end
  }
  return result.map((t) => new Term(t));
};
module.exports = fromString;

},{"../term":49}],66:[function(_dereq_,module,exports){
'use strict';

//getters/setters for the Terms class
module.exports = {

  parent: {
    get: function() {
      return this.refText || this;
    },
    set: function(r) {
      this.refText = r;
      return this;
    }
  },

  parentTerms: {
    get: function() {
      return this.refTerms || this;
    },
    set: function(r) {
      this.refTerms = r;
      return this;
    }
  },

  dirty: {
    get: function() {
      for(let i = 0; i < this.terms.length; i++) {
        if (this.terms[i].dirty === true) {
          return true;
        }
      }
      return false;
    },
    set: function(dirt) {
      this.terms.forEach((t) => {
        t.dirty = dirt;
      });
    }
  },

  refTerms: {
    get: function() {
      return this._refTerms || this;
    },
    set: function(ts) {
      this._refTerms = ts;
      return this;
    }
  },
  found: {
    get: function() {
      return this.terms.length > 0;
    }
  },
  length: {
    get: function() {
      return this.terms.length;
    }
  },
  isA: {
    get: function() {
      return 'Terms';
    }
  },
  whitespace: {
    get: function() {
      return {
        before: (str) => {
          this.firstTerm().whitespace.before = str;
          return this;
        },
        after: (str) => {
          this.lastTerm().whitespace.after = str;
          return this;
        },
      };
    }
  },


};

},{}],67:[function(_dereq_,module,exports){
'use strict';
const build = _dereq_('./build');
const getters = _dereq_('./getters');
const tagger = _dereq_('../tagger');


//Terms is an array of Term objects, and methods that wrap around them
const Terms = function(arr, lexicon, refText, refTerms) {
  this.terms = arr;
  this.lexicon = lexicon;
  this.refText = refText;
  this._refTerms = refTerms;
  this.count = undefined;
  this.get = (n) => {
    return this.terms[n];
  };
  //apply getters
  let keys = Object.keys(getters);
  for(let i = 0; i < keys.length; i++) {
    Object.defineProperty(this, keys[i], getters[keys[i]]);
  }
};

Terms.prototype.tagger = function() {
  return tagger(this);
};

_dereq_('./methods/misc')(Terms);
_dereq_('./methods/out')(Terms);
_dereq_('./methods/loops')(Terms);

Terms.fromString = function(str, lexicon) {
  let termArr = build(str);
  let ts = new Terms(termArr, lexicon, null);
  //give each term a reference to this ts
  ts.terms.forEach((t) => {
    t.parentTerms = ts;
  });
  return ts;
};
module.exports = Terms;

},{"../tagger":21,"./build":65,"./getters":66,"./methods/loops":68,"./methods/misc":69,"./methods/out":70}],68:[function(_dereq_,module,exports){
'use strict';
//these methods are simply term-methods called in a loop

const addMethods = (Terms) => {

  const foreach = [
    ['tag'],
    ['unTag'],
    ['canBe'],
    ['toUpperCase', 'UpperCase'],
    ['toLowerCase'],
    ['toTitleCase', 'TitleCase'],
  // ['toCamelCase', 'CamelCase'],
  ];

  foreach.forEach((arr) => {
    let k = arr[0];
    let tag = arr[1];
    let myFn = function () {
      let args = arguments;
      this.terms.forEach((t) => {
        t[k].apply(t, args);
      });
      if (tag) {
        this.tag(tag, k);
      }
      return this;
    };
    Terms.prototype[k] = myFn;
  });
  return Terms;
};

module.exports = addMethods;

},{}],69:[function(_dereq_,module,exports){
'use strict';

const miscMethods = (Terms) => {

  const methods = {

    firstTerm: function() {
      return this.terms[0];
    },
    lastTerm: function() {
      return this.terms[this.terms.length - 1];
    },
    all: function() {
      return this.parent;
    },
    data: function() {
      return {
        text: this.out('text'),
        normal: this.out('normal'),
      };
    },
    term: function (n) {
      return this.terms[n];
    },
    first: function () {
      let t = this.terms[0];
      return new Terms([t], this.lexicon, this.refText, this.refTerms);
    },
    last: function () {
      let t = this.terms[this.terms.length - 1];
      return new Terms([t], this.lexicon, this.refText, this.refTerms);
    },
    slice: function (start, end) {
      let terms = this.terms.slice(start, end);
      return new Terms(terms, this.lexicon, this.refText, this.refTerms);
    },
    endPunctuation: function () {
      return this.last().terms[0].endPunctuation();
    },
    index: function() {
      let parent = this.parentTerms;
      let first = this.terms[0];
      if (!parent || !first) {
        return null; //maybe..
      }
      for(let i = 0; i < parent.terms.length; i++) {
        if (first === parent.terms[i]) {
          return i;
        }
      }
      return null;
    },
    termIndex: function() {
      let first = this.terms[0];
      let ref = this.refText || this;
      if (!ref || !first) {
        return null; //maybe..
      }
      let n = 0;
      for(let i = 0; i < ref.list.length; i++) {
        let ts = ref.list[i];
        for(let o = 0; o < ts.terms.length; o++) {
          if (ts.terms[o] === first) {
            return n;
          }
          n += 1;
        }
      }
      return n;
    },
    //number of characters in this match
    chars: function() {
      return this.terms.reduce((i, t) => {
        i += t.whitespace.before.length;
        i += t.text.length;
        i += t.whitespace.after.length;
        return i;
      }, 0);
    },
    //just .length
    wordCount: function() {
      return this.terms.length;
    },

    //this has term-order logic, so has to be here
    toCamelCase: function() {
      this.toTitleCase();
      this.terms.forEach((t, i) => {
        if (i !== 0) {
          t.whitespace.before = '';
        }
        t.whitespace.after = '';
      });
      this.tag('#CamelCase', 'toCamelCase');
      return this;
    }
  };

  //hook them into result.proto
  Object.keys(methods).forEach((k) => {
    Terms.prototype[k] = methods[k];
  });
  return Terms;
};

module.exports = miscMethods;

},{}],70:[function(_dereq_,module,exports){
'use strict';
const fns = _dereq_('../paths').fns;

const methods = {
  text: function (ts) {
    return ts.terms.reduce((str, t) => {
      str += t.out('text');
      return str;
    }, '');
  },


  normal: function (ts) {
    let terms = ts.terms.filter((t) => {
      return t.text;
    });
    terms = terms.map((t) => {
      return t.normal; //+ punct;
    });
    return terms.join(' ');
  },

  grid: function(ts) {
    var str = '  ';
    str += ts.terms.reduce((s, t) => {
      s += fns.leftPad(t.text, 11);
      return s;
    }, '');
    return str + '\n\n';
  },

  color: function(ts) {
    return ts.terms.reduce((s, t) => {
      s += fns.printTerm(t);
      return s;
    }, '');
  },
  csv: function(ts) {
    return ts.terms.map((t) => t.normal.replace(/,/g, '')).join(',');
  },

  newlines: function (ts) {
    return ts.terms.reduce((str, t) => {
      str += t.out('text').replace(/\n/g, ' ');
      return str;
    }, '').replace(/^\s/, '');
  },
  /** no punctuation, fancy business **/
  root: function (ts) {
    return ts.terms.filter((t) => t.text).map((t) => t.root).join(' ').toLowerCase();
  },

  html: function (ts) {
    return ts.terms.map((t) => t.render.html()).join(' ');
  },
  debug: function(ts) {
    ts.terms.forEach((t) => {
      t.out('debug');
    });
  }
};
methods.plaintext = methods.text;
methods.normalize = methods.normal;
methods.normalized = methods.normal;
methods.colors = methods.color;
methods.tags = methods.terms;


const renderMethods = (Terms) => {
  Terms.prototype.out = function(str) {
    if (methods[str]) {
      return methods[str](this);
    }
    return methods.text(this);
  };
  //check method
  Terms.prototype.debug = function () {
    return methods.debug(this);
  };
  return Terms;
};

module.exports = renderMethods;

},{"../paths":71}],71:[function(_dereq_,module,exports){
module.exports = {
  fns: _dereq_('../fns'),
  Term: _dereq_('../term')
};

},{"../fns":2,"../term":49}]},{},[3])(3)
});