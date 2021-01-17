const { default: fetch } = require('node-fetch');

const checkCurrys3070 = async () => {
  const response = await fetch(
    'https://www.currys.co.uk/gb/uk/mcd_postcode_check/sProductId/10218742/sPostCode/NR31EP/latitude/52.630886/longitude/1.297355/ajax.html'
  );

  const json = await response.json();

  if (json.data && json.data.postCodeCheck) {
    const data = json.data.postCodeCheck;
    let inStock = false;
    if (
      data.state != 'UNDELIVERABLE' ||
      data.storeState != 'UNCOLLECTABLE_OUT_OF_STOCK'
    ) {
      inStock = true;
    }

    return {
      inStock: inStock,
      store: 'Currys Gigabyte 3070',
      message: data.label + ' / ' + data.storeLabel,
    };
  }
};

const checkStock = async (onlyInstock = false) => {
  let msg = [];
  msg.push(await checkCurrys3070());

  // remove those out of stock if we only want to see instock
  if (onlyInstock) {
    msg = msg.filter((m) => {
      return m.inStock;
    });
  }

  if (msg.length == 0) {
    return '';
  }

  let text = '';
  msg.forEach((m) => {
    if (m.inStock) {
      text = text + ':white_check_mark:';
    } else {
      text = text + ':x:';
    }
    text = text + ' ' + m.store;
  });

  return text;
};

module.exports = {
  checkStock,
};
