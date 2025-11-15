import React, { useMemo, useState } from 'react';
import './index.less';
import { set } from 'lodash';
import { menu } from '@/const';
import { get } from 'lodash';

export default function ProductPage() {
  const [activeCategory, setActiveCategory] = useState('meat');

  const categories = useMemo(() => {
    const categories = [];
    menu.forEach((item) => {
      categories.push(item.type);
    });
    return Array.from(new Set(categories));
  }, menu);

  const typeProducts = useMemo(() => {
    const products: any = { no: [] } as any;
    menu.forEach((item) => {
      const list = get(products, item.type, []);
      if (list?.length > 0) {
        list.push(item);
        set(products, item.type, list);
      } else {
        set(products, item.type, [item]);
      }
    });
    return products;
  }, menu);

  const products = [
    {
      id: 1,
      title: '土豆咖喱鸡',
      desc: '精选鸡腿肉 五花肉',
      price: 15,
      img: '/images/p1.jpg',
    },
    {
      id: 2,
      title: '凉拌鸡丝',
      desc: '清爽 鸡肉 鸡腿丝',
      price: 15,
      img: '/images/p2.jpg',
    },
    {
      id: 3,
      title: '口水鸡',
      desc: '麻辣 鸡肉 香嫩鸡块',
      price: 15,
      img: '/images/p3.jpg',
    },
    {
      id: 4,
      title: '蒜香口蘑鸡腿',
      desc: '口蘑 香菇 鸡腿肉',
      price: 15,
      img: '/images/p4.jpg',
    },
  ];

  return (
    <div className="page-container">
      {/* 左侧分类 */}
      <div className="category-list">
        {categories.map((c) => (
          <div
            key={c}
            className={`category-item ${activeCategory === c ? 'active' : ''}`}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </div>
        ))}
      </div>

      {/* 商品列表 */}
      <div className="product-list">
        {Object.keys(typeProducts).map((type) => {
          const list = typeProducts[`${type}`] || [];
          if (list.length) {
            const type = list[0].type;

            return (
              <>
                <div className="product-header" id={`product-header-${type}`}>
                  {type}
                </div>
                {list.map((item) => {
                  return (
                    <>
                      <div className="product-item" key={item.id}>
                        <img
                          className="product-img"
                          src={item.pictures[0] || ''}
                          alt=""
                        />

                        <div className="product-info">
                          <div className="product-title">{item.name}</div>
                          <div className="product-desc">{item.recipe}</div>

                          <div className="product-bottom">
                            <div className="price">¥{item.price}</div>
                            <div className="add-btn">+</div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </>
            );
          }
          return null;
        })}
        <div className="product-header">肉类</div>

        {products.map((item) => (
          <div className="product-item" key={item.id}>
            <img className="product-img" src={item.img} alt="" />

            <div className="product-info">
              <div className="product-title">{item.title}</div>
              <div className="product-desc">{item.desc}</div>

              <div className="product-bottom">
                <div className="price">¥{item.price}.00</div>
                <div className="add-btn">+</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
