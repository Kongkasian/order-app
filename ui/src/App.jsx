import { useState, useEffect, useMemo } from 'react'
import './App.css'

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// 유틸리티 함수들을 컴포넌트 외부로 이동
const formatPrice = (price) => {
  return price.toLocaleString() + '원'
}

const formatDate = (date) => {
  const d = new Date(date)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  return `${month}월 ${day}일 ${hours}:${minutes}`
}

function App() {
  // 화면 전환 상태
  const [currentView, setCurrentView] = useState('order') // 'order' or 'admin'

  // 메뉴 데이터
  const [menus, setMenus] = useState([])
  const [menusLoading, setMenusLoading] = useState(true)

  // 각 메뉴별 선택된 옵션 관리 (주문 화면)
  const [selectedOptions, setSelectedOptions] = useState({})

  // 장바구니 (주문 화면)
  const [cart, setCart] = useState([])

  // 주문 목록 (관리자 화면 - 모든 주문)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  // 재고 현황 (관리자 화면)
  const [stock, setStock] = useState({})

  // 대시보드 통계
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    received: 0,
    manufacturing: 0,
    completed: 0
  })
  const [statsLoading, setStatsLoading] = useState(false)

  // 메뉴 데이터 로드
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setMenusLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/menus`)
        const result = await response.json()
        
        if (result.success) {
          setMenus(result.data)
        } else {
          console.error('메뉴 로드 실패:', result.error)
          alert('메뉴를 불러올 수 없습니다.')
        }
      } catch (error) {
        console.error('메뉴 로드 오류:', error)
        alert('메뉴를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setMenusLoading(false)
      }
    }
    
    fetchMenus()
  }, [])

  // 관리자 화면 진입 시 데이터 로드
  useEffect(() => {
    if (currentView === 'admin') {
      fetchOrders()
      fetchDashboardStats()
      fetchStockData()
    }
  }, [currentView, menus])

  // 재고 데이터 로드
  const fetchStockData = async () => {
    try {
      const stockPromises = menus.map(menu => 
        fetch(`${API_BASE_URL}/api/menus/${menu.id}/stock`)
          .then(res => res.json())
          .then(result => result.success ? { menuId: result.data.menuId, stock: result.data.stock } : null)
      )
      const stockResults = await Promise.all(stockPromises)
      const stockMap = {}
      stockResults.forEach(result => {
        if (result) {
          stockMap[result.menuId] = result.stock
        }
      })
      setStock(stockMap)
    } catch (error) {
      console.error('재고 로드 오류:', error)
    }
  }

  // 주문 목록 로드
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/orders`)
      const result = await response.json()
      
      if (result.success) {
        setOrders(result.data.map(order => ({
          id: order.id,
          date: order.orderDate,
          status: order.status,
          items: order.items,
          totalAmount: order.totalAmount
        })))
      } else {
        console.error('주문 로드 실패:', result.error)
      }
    } catch (error) {
      console.error('주문 로드 오류:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  // 대시보드 통계 로드
  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`)
      const result = await response.json()
      
      if (result.success) {
        setDashboardStats(result.data)
      } else {
        console.error('통계 로드 실패:', result.error)
      }
    } catch (error) {
      console.error('통계 로드 오류:', error)
    } finally {
      setStatsLoading(false)
    }
  }

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

    // 동일한 메뉴와 옵션 조합 찾기 (원본 배열 변경 방지)
    const sortedOptions = [...menuOptions].sort()
    const cartItemKey = `${menu.id}-${sortedOptions.join(',')}`
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
  const handleOrder = async () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }

    try {
      // 주문 항목 준비 (PRD에 맞는 형식으로 변환)
      const items = cart.map(item => {
        const optionNamesArray = item.optionNames ? item.optionNames.split(', ') : []
        
        // item.price는 개당 가격 (메뉴 가격 + 옵션 가격)
        // 메뉴 정보에서 기본 가격 찾기
        const menu = menus.find(m => m.id === item.menuId)
        const menuBasePrice = menu ? menu.price : 0
        
        // 옵션 가격 계산 (개당 옵션 가격)
        const optionPrice = item.price - menuBasePrice
        
        return {
          menuId: item.menuId,
          menuName: item.menuName,
          quantity: item.quantity,
          options: optionNamesArray,
          price: menuBasePrice, // 메뉴 기본 가격
          optionPrice: optionPrice, // 개당 옵션 가격
          totalPrice: item.totalPrice // 총 가격
        }
      })

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items,
          totalAmount
        })
      })

      const result = await response.json()

      if (result.success) {
        setCart([])
        setSelectedOptions({})
        alert(`주문이 완료되었습니다!\n총 금액: ${totalAmount.toLocaleString()}원`)
        
        // 관리자 화면이면 주문 목록 새로고침
        if (currentView === 'admin') {
          fetchOrders()
          fetchDashboardStats()
        }
      } else {
        alert(result.error || '주문 처리 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('주문 생성 오류:', error)
      alert('주문 처리 중 오류가 발생했습니다.')
    }
  }

  // 재고 조절 (관리자 화면)
  const adjustStock = async (menuId, delta) => {
    const currentStock = stock[menuId] || 0
    const newStock = Math.max(0, currentStock + delta)

    try {
      const response = await fetch(`${API_BASE_URL}/api/menus/${menuId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stock: newStock
        })
      })

      const result = await response.json()

      if (result.success) {
        setStock(prev => ({
          ...prev,
          [menuId]: result.data.stock
        }))
      } else {
        alert(result.error || '재고 수정 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('재고 수정 오류:', error)
      alert('재고 수정 중 오류가 발생했습니다.')
    }
  }

  // 재고 상태 확인 (관리자 화면)
  const getStockStatus = (quantity) => {
    if (quantity === 0) return '품절'
    if (quantity < 5) return '주의'
    return '정상'
  }

  // 주문 상태 변경 (관리자 화면)
  const changeOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      })

      const result = await response.json()

      if (result.success) {
        // 주문 목록 업데이트
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ))
        // 대시보드 통계 새로고침
        fetchDashboardStats()
      } else {
        alert(result.error || '주문 상태 변경 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('주문 상태 변경 오류:', error)
      alert('주문 상태 변경 중 오류가 발생했습니다.')
    }
  }

  // 주문 화면 컴포넌트
  const OrderView = () => (
    <>
      <main className="menu-area">
        {menusLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>메뉴를 불러오는 중...</div>
        ) : (
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
        )}
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
                      {item.optionNames && ` (${item.optionNames})`}
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
          {menus.map(menu => {
            const quantity = stock[menu.id] ?? 0
            const status = getStockStatus(quantity)
            return (
              <div key={menu.id} className="stock-item">
                <div className="stock-info">
                  <div className="stock-name">{menu.name}</div>
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
                    onClick={() => adjustStock(menu.id, -1)}
                  >
                    -
                  </button>
                  <button
                    className="stock-btn"
                    onClick={() => adjustStock(menu.id, 1)}
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
          {ordersLoading ? (
            <div className="orders-empty">주문 목록을 불러오는 중...</div>
          ) : orders.length === 0 ? (
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
                        {item.options && item.options.length > 0 && ` (${item.options.join(', ')})`} x {item.quantity}
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
