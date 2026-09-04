import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sheet from '../../components/Sheet.jsx'
import Button from '../../components/Button.jsx'
import Icon from '../../components/Icon.jsx'
import { useBooking } from '../../context/BookingContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { dishById } from '../../data/menu.js'

export default function CartSheet({ open, onClose }) {
  const { cart, addToCart, removeFromCart, clearCart, addBooking } = useBooking()
  const toast = useToast()
  const navigate = useNavigate()
  const [room, setRoom] = useState('')
  const [notes, setNotes] = useState('')

  const items = Object.entries(cart).map(([id, qty]) => ({ dish: dishById[id], qty }))
  const subtotal = items.reduce((s, { dish, qty }) => s + dish.price * qty, 0)
  const serviceFee = items.length ? 4 : 0
  const total = subtotal + serviceFee
  const maxPrep = items.reduce((m, { dish }) => Math.max(m, parseInt(dish.prep) || 0), 0)

  function placeOrder() {
    addBooking({
      type: 'roomservice',
      title: `Room service · ${items.length} item${items.length > 1 ? 's' : ''}`,
      subtitle: room ? `To Room ${room} · ~${maxPrep + 10} min` : `~${maxPrep + 10} min`,
      image: items[0]?.dish.image,
      total,
      items: items.map(({ dish, qty }) => ({ name: dish.name, qty, price: dish.price })),
      room,
      notes,
    })
    toast('Order placed — on its way to your room')
    clearCart()
    onClose?.()
    navigate('/bookings')
  }

  return (
    <Sheet open={open} onClose={onClose} title="Your order">
      {items.length === 0 ? (
        <div className="cart__empty">
          <Icon name="bag" size={38} color="var(--text-faint)" />
          <p>Your tray is empty. Add something from the menu.</p>
        </div>
      ) : (
        <div className="cart">
          {items.map(({ dish, qty }) => (
            <div key={dish.id} className="cart__item">
              <div className="cart__info">
                <strong>{dish.name}</strong>
                <span className="muted">${dish.price} · {dish.prep}</span>
              </div>
              <div className="cart__stepper">
                <button onClick={() => removeFromCart(dish.id)}>–</button>
                <span>{qty}</span>
                <button onClick={() => addToCart(dish.id)}>+</button>
              </div>
            </div>
          ))}

          <label className="cart__label">Deliver to room</label>
          <input
            className="cart__input"
            placeholder="e.g. 204"
            inputMode="numeric"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />

          <label className="cart__label">Notes for the kitchen</label>
          <textarea
            className="cart__input"
            rows={2}
            placeholder="Allergies, no ice, leave at door…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="cart__from">
            <Icon name="concierge" size={16} color="var(--gold)" />
            <span>Fulfilled by the In-Room Dining desk · dial 3</span>
          </div>

          <div className="cart__summary">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="muted">Subtotal</span><span>${subtotal}</span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
              <span className="muted">Service fee</span><span>${serviceFee}</span>
            </div>
            <div className="cart__total">
              <span>Total</span><span>${total}</span>
            </div>
            <p className="cart__eta"><Icon name="clock" size={13} /> Estimated ~{maxPrep + 10} min</p>
          </div>

          <Button full size="lg" onClick={placeOrder} icon="checkCircle">Place order</Button>
          <p className="cart__fine">Prototype — charged to your room, no payment taken.</p>
        </div>
      )}
    </Sheet>
  )
}
