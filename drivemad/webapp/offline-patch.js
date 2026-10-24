// offline-patch.js — haalt alle Poki-afhankelijkheid weg
(function () {
    // 1) Vervang de echte PokiSDK door een stub
    window.PokiSDK = {
        init: function (opts) {
            // Poki geeft normaal een submitScore-callback; we negeren 'm
            if (opts && typeof opts.submitScore === 'function') {
                try { opts.submitScore(function () {}); } catch (e) {}
            }
            return Promise.resolve();
        },
        gameLoadingStart:    function () {},
        gameLoadingFinished: function () {},
        commercialBreak:     function () { return Promise.resolve(); },     // skip ad
        rewardedBreak:       function () { return Promise.resolve(true); }, // beloning gratis
        gameplayStart:       function () {},
        gameplayStop:        function () {},
        showLeaderboard:     function () {},
        customEvent:         function () {},
        measure:             function () {}
    };

    // 2) Overschrijf initPokiSdk — hier zat de verborgen sitelock/redirect in
    window.initPokiSdk = function () {
        if (typeof setPokiInited === 'function') setPokiInited();
    };

    // 3) Stop het versturen van leveldata naar leveldata.poki.io
    window.pokiSendLevelData = function () {};

    // 4) Stubs voor functies die de WASM aanroept maar die in source_min.js
    //    niet bestaan — voorkomt ReferenceErrors tijdens runtime
    window.adInterstitialLoad          = window.adInterstitialLoad          || function () {};
    window.adRewardedLoad              = window.adRewardedLoad              || function () {};
    window.firebaseSignout             = window.firebaseSignout             || function () {};
    window.setDeepLinkLoadingFraction  = window.setDeepLinkLoadingFraction  || function () {};
    window.showShareFileModal          = window.showShareFileModal          || function (path) {
        if (typeof downloadFileInBrowser === 'function' && path) downloadFileInBrowser(path);
    };
    window.showStoreLinkModal          = window.showStoreLinkModal          || function (url) {
        if (url) window.open(url, '_blank');
    };
})();