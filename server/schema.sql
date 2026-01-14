-- 커피 주문 앱 데이터베이스 스키마

-- Menus 테이블 생성
CREATE TABLE IF NOT EXISTS menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0),
    image VARCHAR(500),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Options 테이블 생성
CREATE TABLE IF NOT EXISTS options (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    menu_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);

-- Orders 테이블 생성
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'manufacturing', 'completed')),
    total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
    items JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date DESC);
CREATE INDEX IF NOT EXISTS idx_options_menu_id ON options(menu_id);

-- 초기 메뉴 데이터 삽입 (중복 방지를 위해 NOT EXISTS 사용)
INSERT INTO menus (name, description, price, image, stock)
SELECT * FROM (VALUES
('아메리카노(ICE)', '시원한 아이스 아메리카노', 4000, 'https://images.unsplash.com/photo-1559056199-641aac8b55e?w=400&h=300&fit=crop', 10),
('아메리카노(HOT)', '따뜻한 핫 아메리카노', 4000, 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop', 10),
('카페라떼', '부드러운 카페라떼', 5000, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop', 10),
('카푸치노', '진한 카푸치노', 5000, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop', 10),
('바닐라라떼', '달콤한 바닐라라떼', 5500, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop', 10),
('에스프레소', '진한 에스프레소', 3000, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop', 10)
) AS v(name, description, price, image, stock)
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE menus.name = v.name);

-- 초기 옵션 데이터 삽입
-- 모든 메뉴에 '샷 추가'와 '시럽 추가' 옵션 추가
INSERT INTO options (name, price, menu_id)
SELECT '샷 추가', 500, id FROM menus
WHERE NOT EXISTS (
  SELECT 1 FROM options WHERE options.menu_id = menus.id AND options.name = '샷 추가'
);

INSERT INTO options (name, price, menu_id)
SELECT '시럽 추가', 0, id FROM menus
WHERE NOT EXISTS (
  SELECT 1 FROM options WHERE options.menu_id = menus.id AND options.name = '시럽 추가'
);
