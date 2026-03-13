import { menuApi } from '@/api';
import { getUrlParams2 } from '@/utils/commonUtils';
import { Button, Carousel } from '@arco-design/web-react';
import React, { useEffect, useMemo, useState } from 'react';

const detail = {
  id: 'id_01',
  name: '鸡翅鸡爪煲',
  type: '肉类',
  ingredients: '鸡翅、鸡爪、生姜、蒜、料酒、酱油、辣椒',
  description: '鸡翅和鸡爪焯水后，与姜蒜爆香，加入酱油和适量清水焖煮至入味。',
  pictures: [],
  price: 0,
};

export default function MenuDetail(props) {
  const id = getUrlParams2().id;

  const [detail, setDetail] = useState<any>({});

  const imageSrc = useMemo(() => {
    return detail?.images?.map((item) => item.url) || [];
  }, [detail]);

  useEffect(() => {
    menuApi
      .getMenuItem(id)
      .then((res) => {
        setDetail(res);
      })
      .catch((err) => {
        setDetail({});
        console.log(err);
      });
  }, [id]);
  return (
    <>
      <Button onClick={() => props.history.goBack()}>返回</Button>
      <Carousel
        autoPlay
        animation="fade"
        showArrow="never"
        style={{ width: 600, height: 240 }}
      >
        {imageSrc.map((src, index) => (
          <div key={index} style={{ width: '100%' }}>
            <img src={src} style={{ width: '100%' }} />
          </div>
        ))}
      </Carousel>
      <div>{detail?.name}</div>
      <div>
        <>{'所需食材'}</>
        {detail?.ingredients}
      </div>
      <div>
        <>{'做法'}</>
        <>{detail?.description}</>
      </div>
      <Button>加菜</Button>
    </>
  );
}
