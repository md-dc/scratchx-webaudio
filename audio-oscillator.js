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
        let name = oscName || oscNames[0];
        if (!oscs[oscName]) {
            oscs[oscName] = new Oscillator();
            oscs[oscName].connect();
            oscs[oscName].start();
        }
        return oscs[oscName];
    }

    // Cleanup function when the extension is unloaded
    ext._shutdown = function () {
        for (let name of oscNames) {
            oscs[name].stop();
            oscs[name] = null;
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

    ext.playOscillator = function (oscName) {
        getOscillator(oscName).play();
    };

    ext.muteOscillator = function (oscName) {
        getOscillator(oscName).mute();
    };

    ext.oscillatorIsPlaying = function (oscName) {
        return getOscillator(oscName).isPlaying;
    };

    ext.muteAllOscillators = function () {
        for (let name of oscNames) {
            ext.muteOscillator(name);
        }
    };

    ext.connectOscillator = function (oscName) {
        getOscillator(oscName).connect();
    };

    ext.disconnectOscillator = function (oscName) {
        if (!oscs[oscName]) return;
        oscs[oscName].disconnect();
    };

    ext.oscillatorIsConnected = function (oscName) {
        if (!oscs[oscName]) return false;
        return oscs[oscName].isConnected();
    };

    ext.disconnectAllOscillators = function () {
        for (let name of oscNames) {
            ext.disconnectOscillator(name);
        }
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            ['r', 'oscillator %m.oscName is playing', 'oscillatorIsPlaying', oscNames[0]],
            [' ', 'play oscillator %m.oscName', 'playOscillator', oscNames[0]],
            [' ', 'mute oscillator %m.oscName', 'muteOscillator', oscNames[0]],
            ['r', 'oscillator %m.oscName type', 'getOscillatorType', oscNames[0]],
            [' ', 'set oscillator %m.oscName type %m.waveType', 'setOscillatorType', oscNames[0], 'sine'],
            ['r', 'oscillator %m.oscName frequency', 'getOscillatorFrequency', oscNames[0]],
            [' ', 'set oscillator %m.oscName frequency %n', 'setOscillatorFrequency', oscNames[0], 440],
            ['r', 'oscillator %m.oscName gain', 'getOscillatorGain', oscNames[0]],
            [' ', 'set oscillator %m.oscName gain %n', 'setOscillatorGain', oscNames[0], 0.5],
            [' ', 'mute all oscillators', 'muteAllOscillators']
        ],
        menus: {
            oscName: oscNames,
            waveType: ['sine', 'square', 'sawtooth', 'triangle']
        }
    };

    // Register the extension
    ScratchExtensions.register('WebAudio Oscillator', descriptor, ext);
})({});

