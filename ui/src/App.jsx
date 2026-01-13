import { useState } from 'react'
import './App.css'

function App() {
  // 메뉴 데이터
  const [menus] = useState([
    {
      id: 1,
      name: '아메리카노(ICE)',
      price: 4000,
      description: '간단한 설명...',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
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

  // 각 메뉴별 선택된 옵션 관리
  const [selectedOptions, setSelectedOptions] = useState({})

  // 장바구니
  const [cart, setCart] = useState([])

  // 옵션 선택/해제
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

  // 장바구니에 추가
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

  // 총 금액 계산
  const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0)

  // 주문하기
  const handleOrder = () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }
    alert(`주문이 완료되었습니다!\n총 금액: ${totalAmount.toLocaleString()}원`)
    setCart([])
    setSelectedOptions({})
  }

  // 숫자를 원화 형식으로 변환
  const formatPrice = (price) => {
    return price.toLocaleString() + '원'
  }

  return (
    <div className="app">
      {/* 헤더 */}
      <header className="header">
        <div className="brand">COZY</div>
        <nav className="nav">
          <button className="nav-button active">주문하기</button>
          <button className="nav-button">관리자</button>
        </nav>
      </header>

      {/* 메뉴 영역 */}
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

      {/* 장바구니 */}
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
    </div>
  )
}

export default App
