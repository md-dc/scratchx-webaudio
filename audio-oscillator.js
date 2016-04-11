/* 
 * ScratchX extension for WebAudio Oscillator
 * 
 * yokobond <koji.yokokawa@yengawa.com>
 */

(function (ext) {
    var audioctx;
    if (typeof (webkitAudioContext) !== "undefined") {
        audioctx = new webkitAudioContext();
    }
    else if (typeof (AudioContext) !== "undefined") {
        audioctx = new AudioContext();
    }

    function Oscillator(waveType, freqValue, gainValue) {
        this.oscillator = audioctx.createOscillator();
        this.gainNode = audioctx.createGain();
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(audioctx.destination);
        this.oscillator.type = waveType || 'sine';
        this.oscillator.frequency.value = freqValue || 440;
        this.gainNode.value = gainValue || 0.5;
    }

    Oscillator.prototype.getType = function () {
        return this.oscillator.type;
    };

    Oscillator.prototype.setType = function (type) {
        this.oscillator.type = type;
        return this;
    };

    Oscillator.prototype.getFrequency = function () {
        return this.oscillator.frequency.value;
    };

    Oscillator.prototype.setFrequency = function (freqValue) {
        this.oscillator.frequency.value = freqValue;
        return this;
    };

    Oscillator.prototype.getGain = function () {
        return this.gainNode.gain.value;
    };

    Oscillator.prototype.setGain = function (gainValue) {
        this.gainNode.gain.value = gainValue;
        return this;
    };

    Oscillator.prototype.start = function () {
        this.oscillator.start();
        return this;
    };

    Oscillator.prototype.stop = function () {
        this.oscillator.stop();
        return this;
    };

    // initialize oscillators
    var oscs = {};
    var oscNames = ["1", "2", "3", "4"];
    // for (let name of oscNames) {
    //     oscs[name] = new Oscillator();
    // }

    /**
     * return oscillator can be start.
     */
    function getOscillator(oscName) {
        let name = oscName || oscNames[0];
        if (!oscs[oscName]) {
            oscs[oscName] = new Oscillator();
        }
        return oscs[oscName];
    }

    // Cleanup function when the extension is unloaded
    ext._shutdown = function () {
        for (let name of oscNames) {
            ext.stopAllOscillators(name);
        }
    };


    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function () {
        return {status: 2, msg: 'Ready'};
    };

    ext.getOscillatorType = function (oscName) {
        return getOscillator(oscName).getType();
    };

    ext.setOscillatorType = function (oscName, type) {
        getOscillator(oscName).setType(type);
    };

    ext.getOscillatorFrequency = function (oscName) {
        return getOscillator(oscName).getFrequency();
    };

    ext.setOscillatorFrequency = function (oscName, freqValue) {
        getOscillator(oscName).setFrequency(freqValue);
    };

    ext.getOscillatorGain = function (oscName) {
        return getOscillator(oscName).getGain();
    };

    ext.setOscillatorGain = function (oscName, gainValue) {
        getOscillator(oscName).setGain(gainValue);
    };

    ext.startOscillator = function (oscName) {
        getOscillator(oscName).start();
    };

    ext.stopOscillator = function (oscName) {
        if (!oscs[oscName]) return;
        oscs[oscName].stop();
        oscs[oscName] = null;
    };

    ext.stopAllOscillators = function () {
        for (let name of oscNames) {
            ext.stopOscillator(name);
        }
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'start oscillator %m.oscName', 'startOscillator', oscNames[0]],
            [' ', 'stop oscillator %m.oscName', 'stopOscillator', oscNames[0]],
            ['r', 'oscillator %m.oscName type', 'getOscillatorType', oscNames[0]],
            [' ', 'set oscillator %m.oscName type %m.waveType', 'setOscillatorType', oscNames[0], 'sine'],
            ['r', 'oscillator %m.oscName frequency', 'getOscillatorFrequency', oscNames[0]],
            [' ', 'set oscillator %m.oscName frequency %n', 'setOscillatorFrequency', oscNames[0], 440],
            ['r', 'oscillator %m.oscName gain', 'getOscillatorGain', oscNames[0]],
            [' ', 'set oscillator %m.oscName gain %n', 'setOscillatorGain', oscNames[0], 0.5],
            [' ', 'stop all oscillator', 'stopAllOscillators']
        ],
        menus: {
            oscName: oscNames,
            waveType: ['sine', 'square', 'sawtooth', 'triangle']
        }
    };

    // Register the extension
    ScratchExtensions.register('WebAudio Oscillator', descriptor, ext);
})({});

