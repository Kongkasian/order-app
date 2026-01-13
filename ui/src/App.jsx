import { useState } from 'react'
import './App.css'

function App() {
  // 화면 전환 상태
  const [currentView, setCurrentView] = useState('order') // 'order' or 'admin'

  // 메뉴 데이터
  const [menus] = useState([
    {
      id: 1,
      name: '아메리카노(ICE)',
      price: 4000,
      description: '간단한 설명...',
      image: 'https://images.unsplash.com/photo-1559056199-641aac8b55e?w=400&h=300&fit=crop',
      options: [
        { id: 'shot', name: '샷 추가', price: 500 },
        { id: 'syrup', name: '시럽 추가', price: 0 }
      ]
    },
    {
      id: 2,
      name: '아메리카노(HOT)',
      price: 4000,
      description: '간단한 설명...',
      image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop',
      options: [
        { id: 'shot', name: '샷 추가', price: 500 },
        { id: 'syrup', name: '시럽 추가', price: 0 }
      ]
    },
    {
      id: 3,
      name: '카페라떼',
      price: 5000,
      description: '간단한 설명...',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
      options: [
        { id: 'shot', name: '샷 추가', price: 500 },
        { id: 'syrup', name: '시럽 추가', price: 0 }
      ]
    },
    {
      id: 4,
      name: '카푸치노',
      price: 5000,
      description: '간단한 설명...',
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
      options: [
        { id: 'shot', name: '샷 추가', price: 500 },
        { id: 'syrup', name: '시럽 추가', price: 0 }
      ]
    },
    {
      id: 5,
      name: '바닐라라떼',
      price: 5500,
      description: '간단한 설명...',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      options: [
        { id: 'shot', name: '샷 추가', price: 500 },
        { id: 'syrup', name: '시럽 추가', price: 0 }
      ]
    },
    {
      id: 6,
      name: '에스프레소',
      price: 3000,
      description: '간단한 설명...',
      image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop',
      options: [
        { id: 'shot', name: '샷 추가', price: 500 },
        { id: 'syrup', name: '시럽 추가', price: 0 }
      ]
    }
  ])

  // 각 메뉴별 선택된 옵션 관리 (주문 화면)
  const [selectedOptions, setSelectedOptions] = useState({})

  // 장바구니 (주문 화면)
  const [cart, setCart] = useState([])

  // 주문 목록 (관리자 화면 - 모든 주문)
  const [orders, setOrders] = useState([])

  // 재고 현황 (관리자 화면 - 메뉴 3개만)
  const [stock, setStock] = useState({
    1: 10, // 아메리카노(ICE)
    2: 10, // 아메리카노(HOT)
    3: 10  // 카페라떼
  })

  // 옵션 선택/해제 (주문 화면)
  const toggleOption = (menuId, optionId) => {
    setSelectedOptions(prev => {
      const menuOptions = prev[menuId] || []
      const isSelected = menuOptions.includes(optionId)
      return {
        ...prev,
        [menuId]: isSelected
          ? menuOptions.filter(id => id !== optionId)
          : [...menuOptions, optionId]
      }
    })
  }

  // 장바구니에 추가 (주문 화면)
  const addToCart = (menu) => {
    const menuOptions = selectedOptions[menu.id] || []
    const selectedOptionsData = menu.options.filter(opt => menuOptions.includes(opt.id))
    const optionPrice = selectedOptionsData.reduce((sum, opt) => sum + opt.price, 0)
    const totalPrice = menu.price + optionPrice
    const optionNames = selectedOptionsData.map(opt => opt.name).join(', ')

    // 동일한 메뉴와 옵션 조합 찾기
    const cartItemKey = `${menu.id}-${menuOptions.sort().join(',')}`
    const existingItem = cart.find(item => item.key === cartItemKey)

    if (existingItem) {
      setCart(cart.map(item => {
        if (item.key === cartItemKey) {
          const newQuantity = item.quantity + 1
          return { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
        }
        return item
      }))
    } else {
      setCart([...cart, {
        key: cartItemKey,
        menuId: menu.id,
        menuName: menu.name,
        optionNames,
        price: totalPrice,
        quantity: 1,
        totalPrice
      }])
    }
  }

  // 총 금액 계산 (주문 화면)
  const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0)

  // 주문하기 (주문 화면)
  const handleOrder = () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }

    // 주문 생성
    const newOrder = {
      id: Date.now(),
      date: new Date(),
      status: 'received', // 'received', 'manufacturing', 'completed'
      items: cart.map(item => ({
        menuId: item.menuId,
        menuName: item.menuName,
        optionNames: item.optionNames,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice
      })),
      totalAmount
    }

    setOrders([newOrder, ...orders])
    setCart([])
    setSelectedOptions({})
    alert(`주문이 완료되었습니다!\n총 금액: ${totalAmount.toLocaleString()}원`)
  }

  // 재고 조절 (관리자 화면)
  const adjustStock = (menuId, delta) => {
    setStock(prev => ({
      ...prev,
      [menuId]: Math.max(0, (prev[menuId] || 0) + delta)
    }))
  }

  // 재고 상태 확인 (관리자 화면)
  const getStockStatus = (quantity) => {
    if (quantity === 0) return '품절'
    if (quantity < 5) return '주의'
    return '정상'
  }

  // 주문 상태 변경 (관리자 화면)
  const changeOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  // 대시보드 통계 계산 (관리자 화면)
  const dashboardStats = {
    total: orders.length,
    received: orders.filter(o => o.status === 'received').length,
    manufacturing: orders.filter(o => o.status === 'manufacturing').length,
    completed: orders.filter(o => o.status === 'completed').length
  }

  // 숫자를 원화 형식으로 변환
  const formatPrice = (price) => {
    return price.toLocaleString() + '원'
  }

  // 날짜 포맷 (관리자 화면)
  const formatDate = (date) => {
    const d = new Date(date)
    const month = d.getMonth() + 1
    const day = d.getDate()
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')
    return `${month}월 ${day}일 ${hours}:${minutes}`
  }

  // 주문 화면 컴포넌트
  const OrderView = () => (
    <>
      <main className="menu-area">
        <div className="menu-grid">
          {menus.map(menu => (
            <div key={menu.id} className="menu-card">
              <div className="menu-image">
                <img src={menu.image} alt={menu.name} />
              </div>
              <div className="menu-info">
                <h3 className="menu-name">{menu.name}</h3>
                <div className="menu-price">{formatPrice(menu.price)}</div>
                <div className="menu-description">{menu.description}</div>
                
                <div className="menu-options">
                  {menu.options.map(option => (
                    <label key={option.id} className="option-label">
                      <input
                        type="checkbox"
                        checked={(selectedOptions[menu.id] || []).includes(option.id)}
                        onChange={() => toggleOption(menu.id, option.id)}
                      />
                      <span>
                        {option.name} ({option.price > 0 ? `+${formatPrice(option.price)}` : '+0원'})
                      </span>
                    </label>
                  ))}
                </div>

                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(menu)}
                >
                  담기
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <aside className="cart-area">
        <h2 className="cart-title">장바구니</h2>
        <div className="cart-content">
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="cart-empty">장바구니가 비어있습니다.</div>
            ) : (
              <ul className="cart-list">
                {cart.map(item => (
                  <li key={item.key} className="cart-item">
                    <span className="cart-item-name">
                      {item.menuName}
                      {item.optionNames && ` (${item.optionNames})`} X {item.quantity}
                    </span>
                    <span className="cart-item-price">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="cart-summary">
            <div className="cart-total">
              <span>총 금액</span>
              <strong>{formatPrice(totalAmount)}</strong>
            </div>
            <button className="order-btn" onClick={handleOrder}>
              주문하기
            </button>
          </div>
        </div>
      </aside>
    </>
  )

  // 관리자 화면 컴포넌트
  const AdminView = () => (
    <div className="admin-container">
      {/* 관리자 대시보드 */}
      <section className="admin-dashboard">
        <h2 className="section-title">관리자 대시보드</h2>
        <div className="dashboard-grid">
          <div className="dashboard-item">
            <div className="dashboard-label">총 주문</div>
            <div className="dashboard-value">{dashboardStats.total}</div>
          </div>
          <div className="dashboard-item">
            <div className="dashboard-label">주문 접수</div>
            <div className="dashboard-value">{dashboardStats.received}</div>
          </div>
          <div className="dashboard-item">
            <div className="dashboard-label">제조 중</div>
            <div className="dashboard-value">{dashboardStats.manufacturing}</div>
          </div>
          <div className="dashboard-item">
            <div className="dashboard-label">제조 완료</div>
            <div className="dashboard-value">{dashboardStats.completed}</div>
          </div>
        </div>
      </section>

      {/* 재고 현황 */}
      <section className="stock-section">
        <h2 className="section-title">재고 현황</h2>
        <div className="stock-list">
          {[1, 2, 3].map(menuId => {
            const menu = menus.find(m => m.id === menuId)
            const quantity = stock[menuId] || 0
            const status = getStockStatus(quantity)
            return (
              <div key={menuId} className="stock-item">
                <div className="stock-info">
                  <div className="stock-name">{menu?.name}</div>
                  <div className="stock-quantity">
                    <span className="stock-count">{quantity}개</span>
                    <span className={`stock-status ${status === '품절' ? 'out' : status === '주의' ? 'warning' : 'normal'}`}>
                      {status}
                    </span>
                  </div>
                </div>
                <div className="stock-controls">
                  <button
                    className="stock-btn"
                    onClick={() => adjustStock(menuId, -1)}
                  >
                    -
                  </button>
                  <button
                    className="stock-btn"
                    onClick={() => adjustStock(menuId, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 주문 현황 */}
      <section className="orders-section">
        <h2 className="section-title">주문 현황</h2>
        <div className="orders-list">
          {orders.length === 0 ? (
            <div className="orders-empty">주문이 없습니다.</div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="order-item">
                <div className="order-info">
                  <div className="order-date">{formatDate(order.date)}</div>
                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-detail">
                        {item.menuName}
                        {item.optionNames && ` (${item.optionNames})`} x {item.quantity}
                      </div>
                    ))}
                  </div>
                  <div className="order-total">{formatPrice(order.totalAmount)}</div>
                </div>
                <div className="order-actions">
                  {order.status === 'received' && (
                    <button
                      className="order-action-btn"
                      onClick={() => changeOrderStatus(order.id, 'manufacturing')}
                    >
                      제조 시작
                    </button>
                  )}
                  {order.status === 'manufacturing' && (
                    <button
                      className="order-action-btn"
                      onClick={() => changeOrderStatus(order.id, 'completed')}
                    >
                      제조 완료
                    </button>
                  )}
                  {order.status === 'completed' && (
                    <span className="order-status-text">제조 완료</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )

  return (
    <div className="app">
      {/* 헤더 */}
      <header className="header">
        <div className="brand">COZY</div>
        <nav className="nav">
          <button
            className={`nav-button ${currentView === 'order' ? 'active' : ''}`}
            onClick={() => setCurrentView('order')}
          >
            주문하기
          </button>
          <button
            className={`nav-button ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentView('admin')}
          >
            관리자
          </button>
        </nav>
      </header>

      {/* 화면 전환 */}
      {currentView === 'order' ? <OrderView /> : <AdminView />}
    </div>
  )
}

export default App
