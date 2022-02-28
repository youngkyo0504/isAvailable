import { JSDOM } from 'jsdom';
import axios from 'axios';
import github from '@actions/github';
import core from '@actions/core';
const URL_LIST = [
  'https://www.jooyonshop.co.kr/goods/goods_view.php?goodsNo=1000000233',
  'https://www.jooyonshop.co.kr/goods/goods_view.php?goodsNo=1000000230',
  'https://www.jooyonshop.co.kr/goods/goods_view.php?goodsNo=1000000166',
  'https://www.jooyonshop.co.kr/goods/goods_view.php?goodsNo=1000000165',
];

async function crawling(URL: string) {
  const response = await axios.get(URL);
  const data = response.data;
  const dom = new JSDOM(data);
  const soldOutBtn = dom.window.document.querySelector('.btn_add_soldout');
  const addOrderBtn = dom.window.document.querySelector('.btn_add_order');
  return !soldOutBtn && addOrderBtn ? `구매 가능합니다. ${URL}` : '구매 불가합니다.';
}

async function main() {
  const salesPossible = [];
  for (const URL of URL_LIST) {
    const result = await crawling(URL);
    salesPossible.push(result);
  }
  core.setOutput('result', salesPossible.join('\n'));
  console.log(salesPossible.join('\n'));
}

main();
