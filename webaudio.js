/* 
 * ScratchX extension for WebAudio
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
        this.oscillator.type = waveType || 'sine';
        this.oscillator.frequency.value = freqValue || 440;
        this.gainValue = gainValue || 1.0;
        this.mute();
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
        return this.gainValue;
    };

    Oscillator.prototype.setGain = function (gainValue) {
        this.gainValue = gainValue;
        if (this.isPlaying) {
            this.gainNode.gain.value = gainValue;
        }
        return this;
    };

    Oscillator.prototype.isConnected = function () {
        return (this.gainNode.numberOfOutputs() > 0);
    };

    Oscillator.prototype.connect = function () {
        this.gainNode.connect(audioctx.destination);
        return this;
    };

    Oscillator.prototype.disconnect = function () {
        this.gainNode.disconnect(audioctx.destination);
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

    Oscillator.prototype.mute = function () {
        this.gainNode.gain.value = 0;
        this.isPlaying = false;
        return this;
    };

    Oscillator.prototype.play = function () {
        this.isPlaying = true;
        this.gainNode.gain.value = this.gainValue;
        return this;
    };


    // initialize oscillators
    var oscs = {};
    var oscNames = ["1", "2", "3", "4"];

    /**
     * return oscillator can be start.
     */
    function getOscillator(oscName) {
        if (!oscs[oscName]) {
            oscs[oscName] = new Oscillator();
            oscs[oscName].connect();
            oscs[oscName].start();
        }
        return oscs[oscName];
    }

    // Cleanup function when the extension is unloaded
    ext._shutdown = function () {
        for (var i = 0; i < oscNames.length; i++) {
            oscs[oscNames[i]].stop();
            oscs[oscNames[i]] = null;
        }
    };


    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function () {
        if (audioctx) {
            return {status: 2, msg: 'Ready'};
        } else {
            return {status: 0, msg: 'No Audio Context'};
        }
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

    ext.playOscillator = function (oscName) {
        getOscillator(oscName).play();
    };

    ext.muteOscillator = function (oscName) {
        var targetOsc = oscs[oscName];
        if (targetOsc) {
            targetOsc.mute();
        }
    };

    ext.oscillatorIsPlaying = function (oscName) {
        var targetOsc = oscs[oscName];
        if (targetOsc) {
            return targetOsc.isPlaying;
        } else {
            return false;
        }
    };

    ext.muteAllOscillators = function () {
        for (var i = 0; i < oscNames.length; i++) {
            ext.muteOscillator(oscNames[i]);
        }
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'play oscillator %m.oscName', 'playOscillator', oscNames[0]],
            [' ', 'mute oscillator %m.oscName', 'muteOscillator', oscNames[0]],
            ['b', 'oscillator %m.oscName is playing', 'oscillatorIsPlaying', oscNames[0]],
            [' ', 'mute all oscillators', 'muteAllOscillators'],
            [' ', 'set oscillator %m.oscName type %m.oscType', 'setOscillatorType', oscNames[0], 'sine'],
            [' ', 'set oscillator %m.oscName frequency %n', 'setOscillatorFrequency', oscNames[0], 440],
            [' ', 'set oscillator %m.oscName gain %n', 'setOscillatorGain', oscNames[0], 0.5],
            ['r', 'oscillator %m.oscName frequency', 'getOscillatorFrequency', oscNames[0]],
            ['r', 'oscillator %m.oscName type', 'getOscillatorType', oscNames[0]],
            ['r', 'oscillator %m.oscName gain', 'getOscillatorGain', oscNames[0]]
        ],
        menus: {
            oscName: oscNames,
            oscType: ['sine', 'square', 'sawtooth', 'triangle']
        }
    };

    // Register the extension
    ScratchExtensions.register('WebAudio', descriptor, ext);
})({});

