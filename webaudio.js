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
        this.delayNode = audioctx.createDelay();
        this.delayNode.delayTime.value = 0.0;
        this.feedbackNode = audioctx.createGain();
        this.feedbackNode.gain.value = 0.0;
        this.cutoffNode = audioctx.createBiquadFilter();
        this.cutoffNode.frequency.value = 2000;
        this.gainNode = audioctx.createGain();

        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.delayNode);
        this.delayNode.connect(this.feedbackNode);
        this.feedbackNode.connect(this.cutoffNode);
        this.cutoffNode.connect(this.delayNode);
        // this.delayNode.connect(this.gainNode);
        // this.oscillator.connect(this.gainNode);

        this.oscillator.type = waveType || 'sine';
        this.oscillator.frequency.value = freqValue || 440;
        this.gainValue = gainValue || 1.0;
        this.off();
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
        if (this.isOn) {
            this.gainNode.gain.value = gainValue;
        }
        return this;
    };

    Oscillator.prototype.getDelay = function () {
        return this.delayNode.delayTime.value;
    };

    Oscillator.prototype.setDelay = function (delayValue) {
        this.delayNode.delayTime.value = delayValue;
        return this;
    };

    Oscillator.prototype.getFeedback = function () {
        return this.feedbackNode.gain.value;
    };

    Oscillator.prototype.setFeedback = function (feedbackValue) {
        this.feedbackNode.gain.value = feedbackValue;
        return this;
    };

    Oscillator.prototype.getCutoff = function () {
        return this.cutoffNode.frequency.value;
    };

    Oscillator.prototype.setCutoff = function (cutoffValue) {
        this.cutoffNode.frequency.value = cutoffValue;
        return this;
    };

    Oscillator.prototype.isConnected = function () {
        return (this.gainNode.numberOfOutputs() > 0);
    };

    Oscillator.prototype.connect = function () {
        // this.gainNode.connect(audioctx.destination);
        this.delayNode.connect(audioctx.destination);
        return this;
    };

    Oscillator.prototype.disconnect = function () {
        // this.gainNode.disconnect(audioctx.destination);
        this.delayNode.disconnect(audioctx.destination);
        return this;
    };

    Oscillator.prototype.start = function () {
        this.oscillator.start();
        return this;
    };

    Oscillator.prototype.stop = function () {
        this.gainNode.gain.value = 0;
        this.isOn = false;
        this.oscillator.stop();
        return this;
    };

    Oscillator.prototype.off = function () {
        this.gainNode.gain.value = 0;
        this.isOn = false;
        return this;
    };

    Oscillator.prototype.on = function () {
        this.isOn = true;
        this.gainNode.gain.value = this.gainValue;
        return this;
    };


    // initialize oscillators
    var oscs = {};
    var oscNames = ['1', '2', '3', '4', '5', '6', '7', '8'];

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

    ext.startOscillator = function (oscName) {
        if (!oscs[oscName]) {
            oscs[oscName] = new Oscillator();
            oscs[oscName].connect();
        }
        oscs[oscName].start();
    }

    ext.disconnectOscillator = function (oscName) {
        var targetOsc = oscs[oscName];
        if (targetOsc) {
            targetOsc.disconnect();
        }
    };

    ext.stopOscillator = function (oscName) {
        var targetOsc = oscs[oscName];
        if (targetOsc) {
            targetOsc.stop();
            oscs[oscName] = null;
        }
    };


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

    ext.getOscillatorDelay = function (oscName) {
        return getOscillator(oscName).getDelay();
    };

    ext.setOscillatorDelay = function (oscName, value) {
        getOscillator(oscName).setDelay(value);
    };

    ext.getOscillatorFeedback = function (oscName) {
        return getOscillator(oscName).getFeedback();
    };

    ext.setOscillatorFeedback = function (oscName, value) {
        getOscillator(oscName).setFeedback(Math.min(Math.max(value, 0.0), 1.0));
    };

    ext.getOscillatorCutoff = function (oscName) {
        return getOscillator(oscName).getCutoff();
    };

    ext.setOscillatorCutoff = function (oscName, value) {
        getOscillator(oscName).setCutoff(value);
    };

    ext.oscillatorOn = function (oscName) {
        getOscillator(oscName).on();
    };

    ext.oscillatorOff = function (oscName) {
        var targetOsc = oscs[oscName];
        if (targetOsc) {
            targetOsc.off();
        }
    };

    ext.oscillatorIsOn = function (oscName) {
        var targetOsc = oscs[oscName];
        if (targetOsc) {
            return targetOsc.isOn;
        } else {
            return false;
        }
    };

    ext.allOscillatorsOff = function () {
        for (var i = 0; i < oscNames.length; i++) {
            ext.oscillatorOff(oscNames[i]);
        }
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'oscillator %m.oscName ON', 'oscillatorOn', oscNames[0]],
            [' ', 'oscillator %m.oscName OFF', 'oscillatorOff', oscNames[0]],
            [' ', 'all oscillators OFF', 'allOscillatorsOff'],
            ['b', 'oscillator %m.oscName is ON', 'oscillatorIsOn', oscNames[0]],
            [' ', 'set oscillator %m.oscName type %m.oscType', 'setOscillatorType', oscNames[0], 'sine'],
            [' ', 'set oscillator %m.oscName frequency %n', 'setOscillatorFrequency', oscNames[0], 440],
            [' ', 'set oscillator %m.oscName gain %n', 'setOscillatorGain', oscNames[0], 0.5],
            [' ', 'set oscillator %m.oscName delay %n', 'setOscillatorDelay', oscNames[0], 0],
            [' ', 'set oscillator %m.oscName feedback %n', 'setOscillatorFeedback', oscNames[0], 0],
            [' ', 'set oscillator %m.oscName cutoff %n', 'setOscillatorCutoff', oscNames[0], 2000],
            ['r', 'oscillator %m.oscName frequency', 'getOscillatorFrequency', oscNames[0]],
            ['r', 'oscillator %m.oscName type', 'getOscillatorType', oscNames[0]],
            ['r', 'oscillator %m.oscName gain', 'getOscillatorGain', oscNames[0]],
            ['r', 'oscillator %m.oscName delay', 'getOscillatorDelay', oscNames[0]],
            ['r', 'oscillator %m.oscName feedback', 'getOscillatorFeedback', oscNames[0]],
            ['r', 'oscillator %m.oscName cutoff', 'getOscillatorCutoff', oscNames[0]]
        ],
        menus: {
            oscName: oscNames,
            oscType: ['sine', 'square', 'sawtooth', 'triangle']
        },
        url: 'http://yokobond.github.io/scratchx-webaudio/'
    };

    // Register the extension
    ScratchExtensions.register('WebAudio', descriptor, ext);
})({});

