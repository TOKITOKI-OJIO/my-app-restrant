local docker desktop config

docker run -d \
  --name mysql-container \
  -e MYSQL_ROOT_PASSWORD=root \
  -p 33061:3306 \
  -p 33060:33060 \
  mysql:8.4.8




remote  

todo




插入初始数据：

-- 插入分类初始数据
INSERT INTO categories (name) VALUES 
('肉类'),
('蔬菜'),
('海鲜'),
('汤'),
('主食'),
('其他');