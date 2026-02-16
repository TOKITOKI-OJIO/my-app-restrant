import React, { useEffect, useMemo, useRef, useState } from 'react';
import './index.less';
import { set } from 'lodash';
import {
  menuItems as menuItemsConst,
  categorys as categorysConst,
} from '@/const';
import { get } from 'lodash';
import { menuApi } from '@/api';

export default function ProductPage() {
  const [activeCategory, setActiveCategory] = useState('meat');

  const [menuItems, setMenuItems] = useState([]);

  const categories = useMemo(() => {
    if (menuItems.length === 0) {
      return categorysConst;
    }
    const categories = menuItems.map((item) => item.category);
    return [...new Set(categories)];
  }, menuItems);

  const categoryProducts = useMemo(() => {
    const products: any = { no: [] } as any;
    console.log(menuItems, 'menuItems');
    menuItems.forEach((item) => {
      const list = get(products, item.category, []);
      if (list?.length > 0) {
        list.push(item);
        set(products, item.category, list);
      } else {
        set(products, item.category, [item]);
      }
    });
    return products;
  }, [menuItems]);

  const sectionRefs = useRef({});
  const scrollRef = useRef(null);

  useEffect(() => {
    menuApi
      .getAllMenuItems()
      .then((res) => {
        console.log(res, 'res');
        setMenuItems(res);
      })
      .catch((err) => {
        setMenuItems(menuItemsConst);
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.5) {
            setActiveCategory(entry.target.id); // 高亮左侧
          }
        });
      },
      {
        root: scrollRef.current, // 右侧滚动容器
        threshold: [0.5], // 可见面积超过 50% 才认为进入该分类
        rootMargin: '0px 0px -50% 0px', // 让判断更稳定（防止 sticky 抢占）
      },
    );

    Object.values(sectionRefs.current).forEach((el: any) =>
      observer.observe(el),
    );

    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-container">
      {/* 左侧分类 */}
      <div className="category-list">
        {categories.map((category) => (
          <div
            key={category}
            className={`category-item ${
              activeCategory === category ? 'active' : ''
            }`}
            onClick={() => {
              setActiveCategory(category);
              document
                .querySelector(`#product-section-${category}`)
                .scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
            }}
          >
            {category}
          </div>
        ))}
      </div>

      {/* 商品列表 */}
      <div className="product-list" ref={scrollRef}>
        {categorysConst.map((category) => {
          const list = categoryProducts[`${category}`] || [];
          if (list.length) {
            const category = list[0].category;

            return (
              <div
                className="product-section"
                id={`product-section-${category}`}
              >
                <div
                  className="product-header product-sticky"
                  id={`${category}`}
                  ref={(el) => (sectionRefs.current[category] = el)}
                >
                  {category}
                </div>
                {list.map((item, index) => {
                  return (
                    <>
                      <div
                        className="product-item"
                        key={item.id}
                        id={`product-header-${category}-${index}`}
                      >
                        <img
                          className="product-img"
                          src={get(item, 'pictures.0.url', '') || ''}
                          alt=""
                        />

                        <div className="product-info">
                          <div className="product-title">{item.name}</div>
                          <div className="product-desc">{item.description}</div>

                          <div className="product-bottom">
                            <div className="price">¥{item.price}</div>
                            <div className="add-btn">+</div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
