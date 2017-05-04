const series = (function () {
    const getPromise = () => {
        let resolve;
        let reject;
        const promise = new Promise((_resolve, _reject) => {
            resolve = _resolve;
            reject = _reject;
        });

        return {
            promise,
            resolve,
            reject
        };
    }

    return (fnArr) => {
        const {
            promise,
            resolve,
            reject
        } = getPromise();

        const wrappedFnArr = new Array(fnArr.length);
        let i = fnArr.length;

        while (i--) {
            (function() {
                const origFn = fnArr[i];
                const nextFn = wrappedFnArr[i + 1] || resolve;
                wrappedFnArr[i] = () => {
                    origFn(nextFn);
                }
            })();
        }

        wrappedFnArr[0]();

        return promise;
    }
})();

// tests

series([
    (cb) => {
        setTimeout(() => {
            console.log(1);
            cb();
        }, 200)
    },
    (cb) => {
        setTimeout(() => {
            console.log(2);
            cb();
        }, 200)
    },
    (cb) => {
        setTimeout(() => {
            console.log(3);
            cb();
        }, 200)
    },
    (cb) => {
        setTimeout(() => {
            console.log(4);
            cb();
        }, 200)
    }
]).then(() => {
    console.log(5);
});