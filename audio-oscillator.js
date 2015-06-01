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
        this.gain = audioctx.createGain();
        this.oscillator.connect(this.gain);
        this.gain.connect(audioctx.destination);
        this.oscillator.type = waveType || 'sine';
        this.oscillator.frequency.value = freqValue || 440;
        this.gain.value = gainValue || 0.5;
    }

    Oscillator.prototype.setType = function (type) {
        this.oscillator.type = type;
        return this;
    }

    Oscillator.prototype.setFrequency = function (freqValue) {
        this.oscillator.frequency.value = freqValue;
        return this;
    }

    Oscillator.prototype.setGain = function (gainValue) {
        this.oscillator.gain.gain.value = gainValue;
        return this;
    }

    Oscillator.prototype.start = function () {
        this.oscillator.oscillator.start();
        return this;
    }

    Oscillator.prototype.stop = function () {
        this.oscillator.oscillator.stop();
        return this;
    }

    var osc;

    /**
     * return oscillator can be start.
     */
    function getOscilator() {
        if (!osc) {
            osc = new Oscillator();
        }
        return osc;
    }

    // Cleanup function when the extension is unloaded
    ext._shutdown = function () {
        ext.oscillatorStop();
    };


    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function () {
        return {status: 2, msg: 'Ready'};
    };

    ext.oscillatorType = function (type) {
        getOscilator().setType(type);
    };

    ext.oscillatorFrequency = function (freqValue) {
        getOscilator().setFrequency(freqValue);
    };

    ext.oscillatorGain = function (gainValue) {
        getOscilator().setGain(gainValue);
    };

    ext.oscillatorStart = function () {
        getOscilator().start();
    };

    ext.oscillatorStop = function () {
        if (!osc) {
            return;
        }
        osc.stop();
        osc = null;
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'start oscillator', 'oscillatorStart'],
            [' ', 'stop oscillator', 'oscillatorStop'],
            [' ', 'set oscillator type %m.waveType', 'oscillatorType', 'sine'],
            [' ', 'set oscillator frequency %n', 'oscillatorFrequency', 440],
            [' ', 'set oscillator gain %n', 'oscillatorGain', 0.5]
        ],
        menus: {
            waveType: ["sine", "square", "sawtooth", "triangle"]
        }
    };

    // Register the extension
    ScratchExtensions.register('WebAudio Oscillator', descriptor, ext);
})({});

