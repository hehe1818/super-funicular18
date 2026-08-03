// pages/asset/index.js

Page({
  data: {
    netAssets: '5380.00',
    totalAssets: '5680.00',
    totalLiabilities: '300.00',
    assetItems: [
      { id: '1', name: '储蓄账户', icon: '🏦', amount: '3500.00', change: '50.00', changePercent: 1.45 },
      { id: '2', name: '微信余额', icon: '💚', amount: '1280.00', change: '120.00', changePercent: 10.35 },
      { id: '3', name: '支付宝', icon: '💙', amount: '680.00', change: '-30.00', changePercent: -4.23 },
      { id: '4', name: '现金', icon: '💵', amount: '220.00', change: '0.00', changePercent: 0 },
      { id: '5', name: '花呗待还', icon: '💳', amount: '300.00', change: '-100.00', changePercent: 50.00, isDebt: true }
    ]
  }
});
