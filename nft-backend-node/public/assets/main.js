var iconService = window['icon-sdk-js'];
var IconAmount = iconService.IconAmount;
var IconConverter = iconService.IconConverter;
var IconBuilder = iconService.IconBuilder;
var requestAddress = document.getElementById("request-address");
var responseAddress = document.getElementById("response-address");
var requestScore = document.getElementById("request-score");
var requestScoreForm = document.getElementById("request-score-form");
var responseScore = document.getElementById("response-score");
// var jsonRpc0 = document.getElementById("json-rpc-0");
var scoreData = document.getElementById("score-data");
var requestSigning = document.getElementById("request-signing");
var responseSigning = document.getElementById("response-signing");
var testCallApiBtn = document.getElementById("test-call-auth-api-btn");
var testCallApiRes = document.getElementById("test-call-auth-api");

window.addEventListener("ICONEX_RELAY_RESPONSE", eventHandler, false);

// type and payload are in event.detail
function eventHandler(event) {
    var type = event.detail.type;
    var payload = event.detail.payload;
    switch (type) {
        case "RESPONSE_ADDRESS":
            fromAddress = payload;
            responseAddress.innerHTML = "> Selected ICX Address : " + payload;
            // jsonRpc0.disabled = false;
            (async function getSessionId() {
                const res = await fetch('/api/v1/users/login', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({ address: fromAddress }),
                });
                const data = await res.json();
                var callTransactionData = new IconBuilder.MessageTransactionBuilder()
                    .from(fromAddress)
                    .to(fromAddress)
                    .stepLimit(IconConverter.toBigNumber(100000))
                    .nid(IconConverter.toBigNumber(83))
                    .nonce(IconConverter.toBigNumber(1))
                    .version(IconConverter.toBigNumber(3))
                    .timestamp((new Date()).getTime() * 1000)
                    .data(IconConverter.fromUtf8(`${data.sessionId}`))
                    .build();
                scoreData.value = JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "icx_sendTransaction",
                    "params": IconConverter.toRawTransaction(callTransactionData),
                    "id": 50889
                });
            })();
            break;
        case "RESPONSE_JSON-RPC":
            responseScore.value = JSON.stringify(payload);
            if (payload && payload.result && payload.result.startsWith('0x')) {
                // Create user
                fetch('/api/v1/users/auth', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    redirect: 'follow',
                    body: JSON.stringify({ address: fromAddress, trxId: payload.result })
                });
            }
            break;
        case "CANCEL_JSON-RPC":
            responseScore.value = null;
            break;
        default:
    }
}

function setRequestScoreForm() {
    (async function sendMessage() {
        const res = await fetch('/api/v1/users/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ address: fromAddress }),
        });
        const data = await res.json();
        var callTransactionData = new IconBuilder.MessageTransactionBuilder()
            .from(fromAddress)
            .to(fromAddress)
            .stepLimit(IconConverter.toBigNumber(100000))
            .nid(IconConverter.toBigNumber(83))
            .nonce(IconConverter.toBigNumber(1))
            .version(IconConverter.toBigNumber(3))
            .timestamp((new Date()).getTime() * 1000)
            .data(IconConverter.fromUtf8(`${data.sessionId}`))
            .build();
        scoreData.value = JSON.stringify({
            "jsonrpc": "2.0",
            "method": "icx_sendTransaction",
            "params": IconConverter.toRawTransaction(callTransactionData),
            "id": 50889
        });
    })();
}

requestAddress.onclick = function () {
    window.dispatchEvent(new CustomEvent('ICONEX_RELAY_REQUEST', {
        detail: {
            type: 'REQUEST_ADDRESS'
        }
    }))
};

requestScore.onclick = function () {
    responseScore.value = null;

    if (!scoreData.value) {
        alert('Need to get Address first!!');
        return
    }

    var parsed = JSON.parse(scoreData.value);
    if (parsed.method === "icx_sendTransaction" && !fromAddress) {
        alert('Select the ICX Address');
        return
    }

    window.dispatchEvent(new CustomEvent('ICONEX_RELAY_REQUEST', {
        detail: {
            type: 'REQUEST_JSON-RPC',
            payload: parsed
        }
    }))
};

testCallApiBtn.onclick = function () {
    (async function() {
        const res = await fetch('/api/v1/files', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });

        const data = await res.json();
        testCallApiRes.innerHTML = JSON.stringify(data);
    })();
}