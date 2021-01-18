const { default: fetch } = require('node-fetch');

const checkCurrys = async (id, description) => {
  const url =
    'https://www.currys.co.uk/gb/uk/mcd_postcode_check/sProductId/' +
    id +
    '/sPostCode/NR31EP/latitude/52.630886/longitude/1.297355/ajax.html';

  const response = await fetch(url);

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
      store: 'Currys - ' + description,
      message: data.label + ' / ' + data.storeLabel,
    };
  }
};

const checkPage = async (url, description, store, preorder, instock) => {
  const response = await fetch(url);

  const text = await response.text();

  let inStock = false;
  let message = 'Unavailble';
  if (preorder != '' && text.indexOf(preorder) >= 0) {
    inStock = true;
    message = 'Pre order';
  }
  if (instock != '' && text.indexOf(instock) >= 0) {
    inStock = true;
    message = 'In stock';
  }

  return {
    inStock: inStock,
    store: store + ' - ' + description,
    message: message,
  };
};

const checkScan = async (url, description) => {
  return checkPage(
    url,
    description,
    'Scan',
    '>Pre Order</a>',
    '>Add To Basket</a>'
  );
};

const checkOverclockers = async (url, description) => {
  return checkPage(
    url,
    description,
    'Overclockers',
    'class="sPreOrderButton"',
    'class="sAddToBasketButton"'
  );
};

const checkEbuyer = async (url, description) => {
  return checkPage(
    url,
    description,
    'EBuyer',
    'value="Pre-order"',
    '>Add to Basket</button>'
  );
};

const checkCCL = async (url, description) => {
  return checkPage(url, description, 'CCL', '', 'id="btnAddToBasket"');
};

const checkStock = async (onlyInstock = false) => {
  let msg = [];

  msg.push(await checkCurrys('10218742', 'Gigabyte 3070'));
  //msg.push(await checkCurrys('10214952', 'iPad'));

  msg.push(
    await checkScan(
      'https://www.scan.co.uk/products/gigabyte-geforce-rtx-3070-vision-oc-8gb-gddr6-ray-tracing-graphics-card-5888-core-1500mhz-gpu-1815mh',
      'Gigabyte 3070'
    )
  );
  /*
  msg.push(
    await checkScan(
      'https://www.scan.co.uk/products/intel-core-i7-10700k-s-1200-comet-lake-8-cores-16-threads-38ghz-51ghz-turbo-16mb-cache',
      'Core i7 10700k'
    )
  );
  msg.push(
    await checkScan(
      'https://www.scan.co.uk/products/750w-corsair-rmx-series-rm750x-full-modular-80plus-gold-sli-crossfire-single-rail-625a-135mm-fan-atx',
      'Corsair RM750x'
    )
  );
  */
  msg.push(
    await checkOverclockers(
      'https://www.overclockers.co.uk/gigabyte-geforce-rtx-3070-vision-oc-8gb-gddr6-pci-express-graphics-card-gx-1cb-gi.html',
      'Gigabyte 3070'
    )
  );
  /*
  msg.push(
    await checkOverclockers(
      'https://www.overclockers.co.uk/intel-core-i7-10700k-avengers-edition-3.8ghz-comet-lake-socket-lga1200-processor-retail-cp-68r-in.html',
      'Core i7 10700k'
    )
  );
  */
  msg.push(
    await checkEbuyer(
      'https://www.overclockers.co.uk/intel-core-i7-10700k-avengers-edition-3.8ghz-comet-lake-socket-lga1200-processor-retail-cp-68r-in.html',
      'Gigabyte 3070'
    )
  );

  msg.push(
    await checkCCL(
      'https://www.cclonline.com/product/333689/GV-N3070VISION-OC-8GD/Graphics-Cards/Gigabyte-GeForce-RTX-3070-VISION-OC-8GB-Overclocked-Graphics-Card/VGA5921/?__cf_chl_jschl_tk__=9d742f9541de79e70c5a024f5b1138bec008b9d6-1610929089-0-AZucStvXGwB_g4M_GnFhrqPPa55e5_EiPCp6VVFe4wnof0wIYrYo4oxyYfs1hygqQ4hRFSMxoKUDFGxfzrXSvebsk81i6-NApxjyQ2fDPTUealeq4ohMITC9OlucXWbhhk4w3mktbA2W1TFRn574hAC0Rfj-xdu5yzKSfj4_bp0XH_VY9Okh7-LHiDu6LMXpHOOiR242KABlHufgRa0-uhZc-zNkb_IEmKB7ow5ylq_iudZUz3it9XcYWj9k3RV-KZaMRRvgVroC0PBYOLa9YqCth6oJ4spkDlM-3BTlj7RHFZFBCuPRGEB6iL1n9eOCVf0idmFiK76JTlIGSLIRS7AkCuzwt0c9o65YLKUjknGdsebQSdJwjx0yZ9RVZ6qLnP9b9qGedsQrlcOvPC-IOYgSvRsEWuYQjoQaX3A_lYlhclN8BUFXbFrP39Hm4JXJdQCOgGo7K4dR0svsjvXGzj6BQxx8TNycU_xqwrArxmWq',
      'Gigabye 3070'
    )
  );

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
    text = text + ' ' + m.store + '\n     *(' + m.message + ')*\n\n';
  });

  return text;
};

module.exports = {
  checkStock,
};
