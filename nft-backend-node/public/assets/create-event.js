$(document).ready(function() {
  var iconService = window['icon-sdk-js'];
  var IconConverter = iconService.IconConverter;
  var IconBuilder = iconService.IconBuilder;

  window.getUser = function () {return {};};
  window.getContract = function () {return { address: 'cx901c6b3846534c99863e6452cfd43e2fa271526b'};};

  $.ajax({
    method: 'GET',
    url: '/api/v1/users',
    success: (data) => {
      console.log('Logged In!!');
      var user = data;
      window.getUser = () => {return user;};
    },
    error: () => {
      alert('You are not logging in!! Access to mainpage "/" to login!!');
    }
  });

  $.ajax({
    method: 'GET',
    url: '/api/v1/contracts',
    success: (data) => {
      console.log('Queried default contract success!!');
      var contract = data;
      window.getContract = () => {return contract;};
    },
    error: () => {
      alert('Cannot queried default contract!! Getting default "cx901c6b3846534c99863e6452cfd43e2fa271526b"');
    }
  });

  function onFieldBlur() {
    var name = $('#event-form #event-name').val();
    var file = $('#event-form #event-image').prop('files');
    var amount = parseInt($('#event-form #event-amount').val()) || 1;

    if (!name || (!file || file.length == 0) || amount == 0) {
      return;
    }

    // Build transaction
    var callTransactionData = new IconBuilder.CallTransactionBuilder()
        .from(window.getUser().address)
        .to(window.getContract().address)
        .stepLimit(IconConverter.toBigNumber(100000))
        .nid(IconConverter.toBigNumber(83))
        .nonce(IconConverter.toBigNumber(1))
        .version(IconConverter.toBigNumber(3))
        .timestamp((new Date()).getTime() * 1000)
        .method('createNFT')
        .params({
            _env: 'vietnam',
            _qtt: amount,
            _uri: 'http://lele.com/',
        })
        .build();
    var transaction = {
        "jsonrpc": "2.0",
        "method": "icx_sendTransaction",
        "params": IconConverter.toRawTransaction(callTransactionData),
        "id": 50889
    };
    $('#transaction-details').val(JSON.stringify(transaction));
  }

  $('#event-form #event-name').on('blur', onFieldBlur);
  $('#event-form #event-image').on('blur', onFieldBlur);
  $('#event-form #event-path').on('blur', onFieldBlur);
  $('#event-form #event-amount').on('blur', onFieldBlur);
  $('#event-form #event-categories').on('blur', onFieldBlur);
  $('#event-form #event-startat').on('blur', onFieldBlur);
  $('#event-form #event-endat').on('blur', onFieldBlur);
  $('#event-form #event-description').on('blur', onFieldBlur);
  $('#event-form #event-name').keyup(() => {
    const path = $('#event-form #event-name').val().trim().toLowerCase().replaceAll(' ', '-');
    $('#event-form #event-path').val(path);
    const now = new Date();
    $('#event-form #event-startat').val(now.toISOString());
    const endAtMill = (new Date).setDate(now.getDate() + 7);
    $('#event-form #event-endat').val(new Date(endAtMill).toISOString());
  });

  $('#event-button').click(function onSubmit() {
    var name = $('#event-form #event-name').val();
    var file = $('#event-form #event-image').prop('files');
    var path = $('#event-form #event-path').val();
    var amount = parseInt($('#event-form #event-amount').val()) || 1;
    var categories = $('#event-form #event-categories').val() || '[]';
    var startAt = $('#event-form #event-startat').val() || '';
    var endAt = $('#event-form #event-endat').val() || '';
    var description = $('#event-form #event-description').val() || '';

    if (!name || (!file || file.length == 0) || !amount) {
      alert('Missing values');
      return;
    }

    (async () => {
      try {
        var data = new FormData();
        data.append('name', name);
        data.append('file', file[0]);
        data.append('path', path);
        data.append('amount', amount);
        data.append('categories', categories);
        data.append('startAt', startAt);
        data.append('endAt', endAt);
        data.append('description', description);

        const apiRes = await $.ajax({
          method: 'POST',
          url: `/api/v1/events/${window.getUser().address}`,
          data: data,
          cache: false,
          contentType: false,
          processData: false,
        });

        $("#result-api").val(JSON.stringify(apiRes));

        var callTransactionData = new IconBuilder.CallTransactionBuilder()
            .from(window.getUser().address)
            .to(window.getContract().address)
            .stepLimit(IconConverter.toBigNumber(100000))
            .nid(IconConverter.toBigNumber(83))
            .nonce(IconConverter.toBigNumber(1))
            .version(IconConverter.toBigNumber(3))
            .timestamp((new Date()).getTime() * 1000)
            .method('createNFT')
            .params({
                _env: 'vietnam',
                _qtt: String(amount),
                _uri: apiRes.imageUrl,
            })
            .build();
        var transaction = {
            "jsonrpc": "2.0",
            "method": "icx_sendTransaction",
            "params": IconConverter.toRawTransaction(callTransactionData),
            "id": 50889
        };
        const transactionRes = await sendTransaction(transaction);
        $("#result-transaction").val(JSON.stringify(transactionRes));

        alert('Success created event');
      } catch (e) {
        alert(`Error ${e.status}: ${e.responseText}`);
      };
    })();
  });

  async function sendTransaction(transaction) {
    return new Promise((resolve, reject) => {
      window.dispatchEvent(new CustomEvent('ICONEX_RELAY_REQUEST', {
        detail: {
            type: 'REQUEST_JSON-RPC',
            payload: transaction
        }
      }));

      window.addEventListener("ICONEX_RELAY_RESPONSE", function (event) {
        const type = event.detail.type;
        const payload = event.detail.payload;
        if (type === 'RESPONSE_JSON-RPC') {
          resolve(payload);
        }
      }, { once: true });
    })
  }
});