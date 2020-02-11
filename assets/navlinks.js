export const navlinks =[
  {name:'Главная',path:'/',icon:'el-icon-s-home'},
  {name:'Заказы',path:'/orders', icon: 'el-icon-shopping-cart-full'},
  {name:'Онлайн заказы',path:'/online'},
  {name:'Каталог',path:'/menu',icon:'el-icon-document'},
  {name:'Товары',path:'/products'},
  {name:'Бренды',path:'/brands'},
  {name:'Категории товаров',path:'/categories'},
  {name:'Склад',path:'/storage',icon:'el-icon-receiving'},
  {name:'Поставки',path:'/supply'},
  {name:'Поставщики',path:'/suppliers'},
  {name:'Склады',path:'/store'},
  {name:'Остатки',path:'/calculation'},
  {name:'Доступ',path:'/access', icon: 'el-icon-unlock'},
  {name:'Отп-сооб',path:'/send_message', icon: 'el-icon-s-promotion'},
  {name:'Отмененные заказы',path:'/canceled'},
  {name:'Доставление заказы',path:'/delivered'},

]
export const routes =[
  {name:'Главная',path:'/',icon:'el-icon-s-home', origin:'/'},
  {name:'Заказы',path:'/orders', icon: 'el-icon-shopping-cart-full', hidden: true},
  {name:'Онлайн заказы',path:'/online', origin: '/orders/online'},
  {name:'Каталог',path:'/menu',icon:'el-icon-document', hidden: true},
  {name:'Товары',path:'/products', origin: '/menu/products'},
  {name:'Категории товаров',path:'/categories', origin: '/menu/categories'},
  {name:'Бренды',path:'/brands', origin: '/menu/brands' },
  {name:'Склад',path:'/storage',icon:'el-icon-receiving', hidden: true},
  {name:'Поставки',path:'/supply', origin:'/storage/supply'},
  {name:'Поставщики',path:'/suppliers', origin:'/storage/suppliers'},
  {name:'Склады',path:'/store', origin:'/storage/suppliers'},
  {name:'Остатки',path:'/calculation'},
  {name:'Доступ',path:'/access', icon: 'el-icon-unlock', origin:'/access'},
  {name:'Отправка сообщение',path:'/send_message', icon: 'el-icon-s-promotion',  origin:'/send_message'},
  {name:'Доставление заказы',path:'/delivered',origin:'/delivered'},
  {name:'Отмененные заказы',path:'/canceled',origin:'/canceled'},
]

export const sortlinks = [
  {path:'/'},
  {path: '/orders'},
  {path: '/menu'},
  {path: '/storage'},
  {path:'/send_message'},
  {path:'/access'},
]
export const hiddenChildren = ['categories_form', 'products_form', 'suppliers_form', 'store_form', 'supply_form', 'access_form', 'brands_form']
