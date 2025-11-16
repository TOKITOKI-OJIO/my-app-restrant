import React, { useEffect, useMemo, useRef, useState } from 'react';
import './index.less';
import { set } from 'lodash';
import { menu, types } from '@/const';
import { get } from 'lodash';

export default function ProductPage() {
  const [activeCategory, setActiveCategory] = useState('meat');

  const categories = useMemo(() => {
    return types;
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

  const sectionRefs = useRef({});
  const scrollRef = useRef(null);

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
      }
    );

    Object.values(sectionRefs.current).forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-container">
      {/* 左侧分类 */}
      <div className="category-list">
        {categories.map((type) => (
          <div
            key={type}
            className={`category-item ${
              activeCategory === type ? 'active' : ''
            }`}
            onClick={() => {
              setActiveCategory(type);
              document
                .querySelector(`#product-section-${type}`)
                .scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
            }}
          >
            {type}
          </div>
        ))}
      </div>

      {/* 商品列表 */}
      <div className="product-list" ref={scrollRef}>
        {types.map((type) => {
          const list = typeProducts[`${type}`] || [];
          if (list.length) {
            const type = list[0].type;

            return (
              <div className="product-section" id={`product-section-${type}`}>
                <div
                  className="product-header product-sticky"
                  id={`${type}`}
                  ref={(el) => (sectionRefs.current[type] = el)}
                >
                  {type}
                </div>
                {list.map((item, index) => {
                  return (
                    <>
                      <div
                        className="product-item"
                        key={item.id}
                        id={`product-header-${type}-${index}`}
                      >
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
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
