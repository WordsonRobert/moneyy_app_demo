import { useMemo, useRef, useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader.jsx'
import Icon from '../../components/Icon.jsx'
import ImageWithFallback from '../../components/ImageWithFallback.jsx'
import { useBooking } from '../../context/BookingContext.jsx'
import { menu, menuCategories, serviceWindows } from '../../data/menu.js'
import CartSheet from './CartSheet.jsx'
import './roomservice.css'

export default function RoomServiceScreen() {
  const { cart, cartCount, addToCart, removeFromCart } = useBooking()
  const [cat, setCat] = useState(menuCategories[0].id)
  const [cartOpen, setCartOpen] = useState(false)
  const listRef = useRef(null)

  const dishes = useMemo(() => menu.filter((d) => d.category === cat), [cat])
  const activeWindow = serviceWindows.find(
    (w) => w.id === menuCategories.find((c) => c.id === cat)?.window,
  )
  const cartTotal = Object.entries(cart).reduce(
    (s, [id, qty]) => s + (menu.find((d) => d.id === id)?.price || 0) * qty,
    0,
  )

  return (
    <div className="rs">
      <ScreenHeader
        title="Room Service"
        subtitle="In-room dining, 7am – 2am"
        right={
          <button className="rs__cart-btn" onClick={() => setCartOpen(true)} aria-label="Cart">
            <Icon name="bag" size={20} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
        }
      />

      {/* Service windows */}
      <div className="rs__windows hide-scroll">
        {serviceWindows.map((w) => (
          <div key={w.id} className="rs-window">
            <div className="rs-window__top">
              <Icon name={w.icon} size={18} color="var(--gold)" />
              <strong>{w.label}</strong>
            </div>
            <span className="rs-window__hours"><Icon name="clock" size={12} /> {w.hours}</span>
            <span className="rs-window__team">{w.orderFrom}</span>
          </div>
        ))}
      </div>

      {/* Category chips */}
      <div className="rs__cats hide-scroll">
        {menuCategories.map((c) => (
          <button
            key={c.id}
            className={`rs__cat ${cat === c.id ? 'is-active' : ''}`}
            onClick={() => {
              setCat(c.id)
              listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {activeWindow && (
        <div className="rs__window-note container">
          <Icon name="clock" size={13} color="var(--gold)" />
          <span>
            Served {activeWindow.hours} · order from {activeWindow.orderFrom}
          </span>
        </div>
      )}

      {/* Menu list */}
      <div className="rs__list container" ref={listRef}>
        {dishes.map((d) => {
          const qty = cart[d.id] || 0
          return (
            <div key={d.id} className="dish fade-up">
              <div className="dish__info">
                <div className="dish__title">
                  <h4>{d.name}</h4>
                  {d.popular && <span className="dish__pop">Popular</span>}
                </div>
                <p className="dish__desc">{d.description}</p>
                <div className="dish__meta">
                  <span className="dish__price">${d.price}</span>
                  <span className="faint"><Icon name="clock" size={12} /> {d.prep}</span>
                  {d.tags.map((t) => (
                    <span key={t} className="dish__tag">{t}</span>
                  ))}
                </div>
              </div>
              <div className="dish__media">
                {d.image && <ImageWithFallback src={d.image} alt={d.name} className="dish__img" />}
                {qty === 0 ? (
                  <button className="dish__add" onClick={() => addToCart(d.id)}>
                    <Icon name="plus" size={16} color="#241a0d" /> Add
                  </button>
                ) : (
                  <div className="dish__stepper">
                    <button onClick={() => removeFromCart(d.id)}>–</button>
                    <span>{qty}</span>
                    <button onClick={() => addToCart(d.id)}>+</button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ height: cartCount > 0 ? 90 : 20 }} />

      {/* Sticky cart bar */}
      {cartCount > 0 && (
        <button className="rs__cartbar" onClick={() => setCartOpen(true)}>
          <span className="rs__cartbar-count">{cartCount}</span>
          <span>View order</span>
          <span className="rs__cartbar-total">${cartTotal}</span>
        </button>
      )}

      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
