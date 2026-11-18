import { useEffect, useMemo, useRef, useState } from "react";
import {
  dateLabel,
  loadStore,
  makeId,
  money,
  persistStore,
  videoAssets
} from "./catalog.js";
import FounderPage from "./FounderPage.jsx";
import SocialLinks from "./SocialLinks.jsx";

function Brand({ footer = false, onHome }) {
  return (
    <a className={`brand${footer ? " footer-brand" : ""}`} href={footer ? "#top" : "#"} onClick={onHome} aria-label="Kadels Klothing home">
      <img className="brand-logo" src="assets/logo.png" alt="Kadels Klothing — Be exclusive, Be Divine, Be yourself" />
      <span className="brand-name">KADELS <small>KLOTHING</small></span>
    </a>
  );
}

function Header({ isAdmin, cartCount, onStudio, onCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className="announcement">Made with intention, made for you <span>·</span> Complimentary custom-fit consultation</div>
      <header className="site-header" id="top">
        <Brand />
        <nav className={`main-nav${menuOpen ? " open" : ""}`} aria-label="Main navigation">
          <a className={isAdmin ? "hidden" : ""} href="#shop" onClick={() => setMenuOpen(false)}>Shop</a>
          <a className={isAdmin ? "hidden" : ""} href="#custom" onClick={() => setMenuOpen(false)}>Custom fit</a>
          <a className={isAdmin ? "hidden" : ""} href="#story" onClick={() => setMenuOpen(false)}>Our story</a>
        </nav>
        <div className="header-actions">
          <button className="text-button admin-link" type="button" onClick={onStudio}>Studio</button>
          <button className="cart-button" type="button" onClick={onCart} aria-label={`Open shopping bag with ${cartCount} items`}>Bag <span id="cart-count">{cartCount || ""}</span></button>
          <button className="menu-button" type="button" onClick={() => setMenuOpen(open => !open)} aria-label="Toggle menu">☰</button>
        </div>
      </header>
    </>
  );
}

function Footer({ onHome }) {
  return (
    <footer className="site-footer">
      <Brand footer onHome={onHome} />
      <p>Be exclusive. Be divine. Be yourself.</p>
      <SocialLinks footer />
      <span>© {new Date().getFullYear()} Kadels Klothing</span>
    </footer>
  );
}

function VideoProductMedia({ product, onError }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
      video.currentTime = 0;
      setPlaying(false);
      return;
    }
    setPlaying(true);
    try {
      video.muted = true;
      video.volume = 0;
      await video.play();
    } catch {
      setPlaying(false);
      onError("This clip could not play in the current preview.");
    }
  };

  const keepMuted = event => {
    const video = event.currentTarget;
    if (!video.muted || video.volume !== 0) {
      video.muted = true;
      video.volume = 0;
    }
  };

  return (
    <>
      <img className={`video-poster${playing ? " hidden" : ""}`} src={product.poster} alt={`Preview frame from ${product.name} video`} loading="lazy" />
      <video
        ref={videoRef}
        className={`catalog-video${playing ? "" : " hidden"}`}
        src={product.video}
        poster={product.poster}
        aria-label={`${product.name} video`}
        controls
        controlsList="nodownload"
        disablePictureInPicture
        disableRemotePlayback
        muted
        playsInline
        preload="none"
        onVolumeChange={keepMuted}
        onEnded={() => setPlaying(false)}
        onContextMenu={event => event.preventDefault()}
      />
      <button className={`video-play-button${playing ? " playing" : ""}`} type="button" onClick={togglePlayback} aria-label={playing ? "Stop video preview" : `Play ${product.name} video`}>
        {playing ? "×" : "▶"}
      </button>
    </>
  );
}

function ProductCard({ product, onAdd, onError }) {
  return (
    <article className="product-card">
      <div className={`product-image${product.videoProduct ? " video-product-image" : ""}`}>
        {product.videoProduct
          ? <VideoProductMedia product={product} onError={onError} />
          : <img src={product.image} alt={product.name} loading="lazy" />}
        <span className="product-badge">{product.badge || product.category}</span>
        <button className="add-button" type="button" onClick={() => onAdd(product.id)} aria-label={`${product.price == null ? "Request" : "Add"} ${product.name} ${product.price == null ? "" : "to bag"}`}>+</button>
      </div>
      <div className="product-details">
        <div className="product-meta"><h3>{product.name}</h3><span className="product-price">{money(product.price)}</span></div>
        <p className="product-category">{product.category} · Thoughtfully made</p>
      </div>
    </article>
  );
}

function CartDrawer({ open, onClose, store, setStore, onCheckout }) {
  const items = store.cart.map(item => ({
    ...item,
    product: store.products.find(product => product.id === item.productId)
  })).filter(item => item.product);
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const hasUnpriced = items.some(item => item.product.price == null);
  const total = items.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);

  const updateQuantity = (productId, delta) => {
    setStore(current => ({
      ...current,
      cart: current.cart
        .map(item => item.productId === productId ? { ...item, quantity: item.quantity + delta } : item)
        .filter(item => item.quantity > 0)
    }));
  };

  const remove = productId => setStore(current => ({
    ...current,
    cart: current.cart.filter(item => item.productId !== productId)
  }));

  return (
    <div className={`overlay${open ? "" : " hidden"}`} id="cart-overlay">
      <button className="overlay-scrim" type="button" onClick={onClose} aria-label="Close shopping bag" />
      <aside className="cart-drawer" aria-label="Shopping bag">
        <div className="drawer-header">
          <div><p className="eyebrow">YOUR EDIT</p><h2>Your bag <span>({quantity})</span></h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close bag">×</button>
        </div>
        <div className="cart-items">
          {items.length ? items.map(item => (
            <article className="cart-line" key={item.productId}>
              <img src={item.product.videoProduct ? item.product.poster : item.product.image} alt="" />
              <div>
                <h3>{item.product.name}</h3><span className="cart-price">{money(item.product.price)}</span>
                <div className="quantity-control">
                  <button type="button" onClick={() => updateQuantity(item.productId, -1)} aria-label="Remove one">−</button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.productId, 1)} aria-label="Add one">+</button>
                </div>
              </div>
              <button className="remove-item" type="button" onClick={() => remove(item.productId)} aria-label={`Remove ${item.product.name}`}>×</button>
            </article>
          )) : <div className="cart-empty">A little room for something lovely.</div>}
        </div>
        <div className="cart-footer">
          <div className="subtotal"><span>Subtotal</span><strong>{hasUnpriced ? "Price to be confirmed" : money(total)}</strong></div>
          <p>Shipping and any custom-fit details are confirmed after you place your request.</p>
          <button className="button button-dark full-button" type="button" onClick={onCheckout} disabled={!items.length} style={{ opacity: items.length ? 1 : .5 }}>Continue to checkout <span>→</span></button>
          <button className="quiet-link continue-shopping" type="button" onClick={onClose}>Continue exploring</button>
        </div>
      </aside>
    </div>
  );
}

function CheckoutModal({ open, onClose, onSubmit, total }) {
  return (
    <div className={`modal-backdrop${open ? "" : " hidden"}`}>
      <section className="modal checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <div className="modal-heading">
          <div><p className="eyebrow">ALMOST YOURS</p><h2 id="checkout-title">Where should we reach you?</h2><p>Your order request will be saved for the studio to follow up.</p></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form onSubmit={onSubmit}>
          <label>Your name<input name="name" required autoComplete="name" placeholder="Name" /></label>
          <label>Email or phone<input name="contact" required placeholder="How can we reach you?" /></label>
          <label>Delivery notes <span className="optional">(optional)</span><textarea name="notes" rows="2" placeholder="Anything we should know?" /></label>
          <div className="checkout-total"><span>Order total</span><strong>{total}</strong></div>
          <button className="button button-dark full-button" type="submit">Place order request <span>→</span></button>
        </form>
      </section>
    </div>
  );
}

function MeasurementModal({ open, onClose, onSubmit }) {
  return (
    <div className={`modal-backdrop${open ? "" : " hidden"}`}>
      <section className="modal measurement-modal" role="dialog" aria-modal="true" aria-labelledby="measurement-title">
        <div className="modal-heading">
          <div><p className="eyebrow">MADE TO MEASURE</p><h2 id="measurement-title">Let’s make it yours.</h2><p>Share your details and we’ll keep them with your request.</p></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <label>Your name<input name="name" required autoComplete="name" placeholder="Name" /></label>
            <label>Email or phone<input name="contact" required autoComplete="email" placeholder="How can we reach you?" /></label>
          </div>
          <label>What would you love made?<textarea name="design" required rows="3" placeholder="Tell us about the piece, occasion, or fabric you have in mind." /></label>
          <p className="form-section-label">MEASUREMENTS <span>in centimetres · measure over light clothing</span></p>
          <p className="measurement-guide">Use a soft tape, keep it comfortably close without pulling tight, and note the garment length you prefer. Bust: fullest point · Waist: natural waist · Hips: fullest point · Shoulder: across the back · Sleeve: shoulder to wrist.</p>
          <div className="form-grid measurement-grid">
            {[["Bust", "bust"], ["Waist", "waist"], ["Hips", "hips"], ["Shoulder", "shoulder"], ["Sleeve length", "sleeve"], ["Garment length", "length"]].map(([label, name]) => (
              <label key={name}>{label}<input type="number" min="1" step="0.5" name={name} placeholder="cm" /></label>
            ))}
          </div>
          <label className="check-label"><input type="checkbox" name="measurement-confirm" /> I understand these are a starting point; the studio will confirm fit details with me.</label>
          <button className="button button-dark full-button" type="submit">Send custom request <span>↗</span></button>
        </form>
      </section>
    </div>
  );
}

function Storefront({ products, onAdd, onError, onMeasurement }) {
  const [category, setCategory] = useState("All pieces");
  const [sort, setSort] = useState("featured");
  const categories = ["All pieces", ...new Set(products.map(product => product.category))];
  const visibleProducts = useMemo(() => {
    const filtered = category === "All pieces" ? [...products] : products.filter(product => product.category === category);
    if (sort === "price-low") filtered.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === "price-high") filtered.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    return filtered;
  }, [products, category, sort]);

  return (
    <main id="store-view">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> THE KADELS EDIT · 01</p>
          <h1>Wear what<br />makes you <em>feel.</em></h1>
          <p className="hero-description">Considered design. Beautiful fabrics. A fit that feels like it was made just for you.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#shop">Explore the collection <span>↗</span></a>
            <a className="quiet-link" href="#custom">Made for your measurements <span>→</span></a>
          </div>
          <div className="hero-note"><span className="note-star">✳</span> SMALL-BATCH · MADE WITH CARE</div>
        </div>
        <div className="hero-visual">
          <img src="assets/KK.jpg" alt="Kadels Klothing founder wearing a vibrant pink custom dress" />
          <div className="image-caption"><span>THE SIGNATURE LOOK</span><span>01 / 04</span></div>
          <div className="hero-sticker">Be<br />yourself<span>✳</span></div>
        </div>
      </section>

      <div className="promise-strip">
        <div><span className="promise-icon">✳</span> Made with intention</div>
        <div><span className="promise-icon">↗</span> Custom fit, made simple</div>
        <div><span className="promise-icon">♡</span> Thoughtful from first stitch</div>
      </div>

      <section className="collection section-wrap" id="shop">
        <div className="section-heading">
          <div><p className="eyebrow">THE COLLECTION</p><h2>Pieces to keep close.</h2></div>
          <a className="quiet-link desktop-link" href="#shop">Discover your next favourite <span>→</span></a>
        </div>
        <p className="collection-note">Photo pieces and video pieces are each listed on their own.</p>
        <div className="collection-tools">
          <div className="filters" id="category-filters" aria-label="Filter products">
            {categories.map(item => <button key={item} className={`filter-button${category === item ? " active" : ""}`} type="button" onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <label className="sort-control">Sort by
            <select aria-label="Sort products" value={sort} onChange={event => setSort(event.target.value)}>
              <option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>
        <div className="product-grid">
          {visibleProducts.map(product => <ProductCard key={product.id} product={product} onAdd={onAdd} onError={onError} />)}
        </div>
        {!visibleProducts.length && <div className="empty-state">No pieces in this edit just yet.</div>}
      </section>

      <section className="custom-banner" id="custom">
        <div className="custom-image"><img src="assets/madeforyou.jpg" alt="A vivid pink made-to-measure Kadels Klothing look" /></div>
        <div className="custom-copy">
          <p className="eyebrow">MADE FOR YOU, NOT THE RACK</p>
          <h2>Your fit.<br />Your <em>story.</em></h2>
          <p>Have an occasion, an idea, or a favourite fabric in mind? We’ll work with your measurements to make a piece that feels unmistakably yours.</p>
          <button className="button button-dark" type="button" onClick={onMeasurement}>Start a custom request <span>↗</span></button>
          <p className="micro-copy">A few simple measurements are all we need to begin.</p>
        </div>
      </section>

      <section className="founder section-wrap" id="story">
        <div className="founder-copy">
          <p className="eyebrow">A NOTE FROM THE FOUNDER</p>
          <h2>Clothing should<br />feel like <em>you.</em></h2>
          <p>Kadels Klothing is built around a simple belief: the most beautiful thing you can wear is your own confidence. Each piece begins with care, curiosity, and a love for making something personal.</p>
          <p>Led by CEO and designer Kadel, the studio brings thoughtful details and expressive style together—whether you’re choosing a ready-to-wear favourite or dreaming up something custom.</p>
          <div className="signature">With love, <span>Kadel</span></div>
          <span className="founder-caption">FOUNDER & CREATIVE DIRECTOR</span>
          <a className="button button-dark founder-profile-link" href="founder.html">Meet the founder <span>↗</span></a>
        </div>
        <div className="founder-photo">
          <img src="assets/founder.jpg" alt="A Kadels Klothing statement set, made with expressive print" />
          <div className="photo-tag">DESIGNED TO<br />FEEL LIKE YOU.</div>
        </div>
      </section>

      <section className="closing-note">
        <span className="note-star">✳</span>
        <p>Be exclusive. Be divine. <em>Be yourself.</em></p>
        <a href="#shop">Find your piece <span>→</span></a>
      </section>
    </main>
  );
}

function ProductTable({ products, setStore, onDelete, onError }) {
  const updateProduct = (productId, patch) => setStore(current => ({
    ...current,
    products: current.products.map(product => product.id === productId ? { ...product, ...patch } : product)
  }));

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Piece</th><th>Category</th><th>Price</th><th>Video file</th><th>Visibility</th><th>Actions</th></tr></thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td><div className="table-product">
                <img src={product.videoProduct ? product.poster : product.image} alt="" />
                <input className="product-name-input" aria-label={`Name for ${product.name}`} defaultValue={product.name} onBlur={event => {
                  const name = event.target.value.trim();
                  if (!name) {
                    event.target.value = product.name;
                    onError("Enter a name for this piece.");
                    return;
                  }
                  if (name !== product.name) updateProduct(product.id, { name });
                }} />
              </div></td>
              <td>{product.category}</td>
              <td><input aria-label={`Price for ${product.name}`} type="number" min="1" step="1" placeholder={product.price == null ? "Set price" : ""} defaultValue={product.price ?? ""} onBlur={event => {
                if (!event.target.value.trim()) {
                  if (product.price != null) updateProduct(product.id, { price: null });
                  return;
                }
                const price = Number(event.target.value);
                if (!Number.isFinite(price) || price <= 0) {
                  event.target.value = product.price ?? "";
                  onError("Enter a price greater than zero.");
                  return;
                }
                if (price !== product.price) updateProduct(product.id, { price });
              }} /></td>
              <td>{product.videoProduct
                ? <select className="video-file-select" aria-label={`Video file for ${product.name}`} value={product.video} onChange={event => {
                    const video = event.target.value;
                    const filename = video.split("/").pop();
                    updateProduct(product.id, { video, poster: `assets/video-posters/${filename.replace(/\.[^.]+$/, ".jpg")}` });
                  }}>
                    {videoAssets.map(filename => <option key={filename} value={`assets/${filename}`}>{filename}</option>)}
                  </select>
                : <span className="photo-product-label">Photo product</span>}
              </td>
              <td><select aria-label={`Visibility for ${product.name}`} value={String(product.active)} onChange={event => updateProduct(product.id, { active: event.target.value === "true" })}><option value="true">Live</option><option value="false">Hidden</option></select></td>
              <td><button className="small-action danger" type="button" onClick={() => onDelete(product)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrdersTable({ orders, setStore }) {
  if (!orders.length) return <div className="admin-empty">No orders yet. They’ll show here when a customer places a request.</div>;
  const statuses = ["New", "Confirmed", "In progress", "Ready", "Completed", "Cancelled"];
  return (
    <div className="admin-table-wrap"><table className="admin-table">
      <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
      <tbody>{orders.map(order => (
        <tr key={order.id}>
          <td><strong>{order.id}</strong></td><td>{order.name}<br /><span className="muted-cell">{order.contact}</span></td>
          <td>{dateLabel(order.date)}</td><td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} piece(s)</td>
          <td>{money(order.total)}</td>
          <td><select className="status-select" value={order.status} onChange={event => setStore(current => ({ ...current, orders: current.orders.map(item => item.id === order.id ? { ...item, status: event.target.value } : item) }))}>
            {statuses.map(status => <option key={status}>{status}</option>)}
          </select></td>
        </tr>
      ))}</tbody>
    </table></div>
  );
}

function RequestsList({ requests, setStore }) {
  if (!requests.length) return <div className="admin-empty">No custom requests yet. New requests will be kept here.</div>;
  const statuses = ["New", "Contacted", "In progress", "Completed"];
  return requests.map(request => {
    const measurements = Object.entries(request.measurements || {}).filter(([, value]) => value).map(([key, value]) => `${key} ${value} cm`).join(" · ") || "Measurements to be confirmed";
    return (
      <article className="request-card" key={request.id}>
        <div className="request-card-header">
          <div><h3>{request.name} <span className="muted-cell">· {request.id}</span></h3><p>{request.contact} · {dateLabel(request.date)}</p></div>
          <select aria-label={`Status for ${request.name}`} value={request.status} onChange={event => setStore(current => ({ ...current, requests: current.requests.map(item => item.id === request.id ? { ...item, status: event.target.value } : item) }))}>
            {statuses.map(status => <option key={status}>{status}</option>)}
          </select>
        </div>
        <p>{request.design}</p><p className="measurements">{measurements}</p>
      </article>
    );
  });
}

function Admin({ store, setStore, activeTab, setActiveTab, onBack, onError }) {
  const revenue = store.orders.filter(order => order.status !== "Cancelled").reduce((sum, order) => sum + (order.total || 0), 0);
  const openOrders = store.orders.filter(order => !["Completed", "Cancelled"].includes(order.status)).length;
  const deleteProduct = product => {
    if (!window.confirm(`Remove "${product.name}" from the catalog?`)) return;
    setStore(current => ({
      ...current,
      products: current.products.filter(entry => entry.id !== product.id),
      cart: current.cart.filter(entry => entry.productId !== product.id)
    }));
  };

  const addProduct = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const image = String(data.get("image")).trim();
    if (!image.startsWith("assets/") && !/^https?:\/\//i.test(image)) {
      onError("Use an assets/ path or a full image URL.");
      return;
    }
    setStore(current => ({
      ...current,
      products: [...current.products, {
        id: makeId("piece"),
        name: String(data.get("name")).trim(),
        category: data.get("category"),
        price: Number(data.get("price")),
        image,
        video: "",
        videoProduct: false,
        badge: "Studio edit",
        active: true
      }]
    }));
    event.currentTarget.reset();
  };

  let content;
  if (activeTab === "overview") {
    content = <>
      <div className="stats-grid">
        <div className="stat-card"><span>Orders to look after</span><strong>{openOrders}</strong></div>
        <div className="stat-card"><span>Order requests</span><strong>{store.orders.length}</strong></div>
        <div className="stat-card"><span>Request value*</span><strong>{money(revenue)}</strong></div>
        <div className="stat-card"><span>Live pieces</span><strong>{store.products.filter(product => product.active).length}</strong></div>
      </div>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><h2>Recent orders</h2><p>Keep an eye on each order as it moves through the studio.</p></div><button className="small-action" type="button" onClick={() => setActiveTab("orders")}>View all →</button></div>
        <OrdersTable orders={store.orders.slice(0, 5)} setStore={setStore} />
      </section>
      <p className="local-note left-note">*Request value is the total of submitted order requests, not confirmed sales.</p>
    </>;
  } else if (activeTab === "orders") {
    content = <section className="admin-panel"><div className="admin-panel-heading"><div><h2>Orders</h2><p>Update a status as you confirm and prepare each order.</p></div></div><OrdersTable orders={store.orders} setStore={setStore} /></section>;
  } else if (activeTab === "products") {
    content = <section className="admin-panel">
      <div className="admin-panel-heading"><div><h2>Your collection</h2><p>Photo and video listings are separate pieces. Set a video piece price here, or leave it on request.</p></div></div>
      {store.products.length
        ? <ProductTable products={store.products} setStore={setStore} onDelete={deleteProduct} onError={onError} />
        : <div className="admin-empty">Your collection is ready for its first piece.</div>}
      <form className="admin-product-form" onSubmit={addProduct}>
        <label>Piece name<input name="name" required placeholder="e.g. Sunday Best Set" /></label>
        <label>Category<select name="category"><option>Dresses</option><option>Ready to wear</option><option>Separates</option><option>Custom</option></select></label>
        <label>Price (GHS)<input name="price" type="number" min="1" step="1" required placeholder="850" /></label>
        <label>Image path<input name="image" required placeholder="assets/photo.jpg" /></label>
        <button className="button button-dark" type="submit">Add piece <span>+</span></button>
      </form>
    </section>;
  } else {
    content = <section className="admin-panel"><div className="admin-panel-heading"><div><h2>Custom requests</h2><p>Measurements are stored on this device. Follow up to confirm the final fit together.</p></div></div><RequestsList requests={store.requests} setStore={setStore} /></section>;
  }

  return (
    <main id="admin-view">
      <section className="admin-shell">
        <div className="admin-top">
          <div><p className="eyebrow">KADELS KLOTHING · STUDIO</p><h1>Your studio, <em>at a glance.</em></h1><p className="admin-lede">A simple overview of your shop and the people behind each order.</p></div>
          <button className="button button-outline" type="button" onClick={onBack}>← Back to storefront</button>
        </div>
        <div className="admin-tabs" role="tablist">
          {[["overview", "Overview"], ["orders", "Orders"], ["products", "Products"], ["custom-requests", "Custom requests"]].map(([id, label]) => (
            <button key={id} className={`admin-tab${activeTab === id ? " active" : ""}`} type="button" role="tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)}>
              {label}{id === "orders" && <span className="tab-count">{store.orders.length}</span>}{id === "custom-requests" && <span className="tab-count">{store.requests.length}</span>}
            </button>
          ))}
        </div>
        {content}
        <p className="local-note">Studio preview · Supabase is not configured. Changes are saved on this device only, not shared with the live site.</p>
      </section>
    </main>
  );
}

function Toast({ message }) {
  return <div className={`toast${message ? " show" : ""}`} role="status" aria-live="polite">{message}</div>;
}

export default function App() {
  const isFounderPage = window.location.pathname.endsWith("/founder.html");
  const [store, setStore] = useState(loadStore);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [cartOpen, setCartOpen] = useState(false);
  const [measurementOpen, setMeasurementOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => {
    persistStore(store);
  }, [store]);

  useEffect(() => {
    document.title = isFounderPage ? "Meet the Founder — Kadels Klothing" : "Kadels Klothing — Be exclusive. Be divine. Be yourself.";
  }, [isFounderPage]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    const modalOpen = cartOpen || measurementOpen || checkoutOpen;
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, measurementOpen, checkoutOpen]);

  const showToast = message => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2800);
  };

  if (isFounderPage) return <FounderPage />;

  const cartItems = store.cart.map(item => ({
    ...item,
    product: store.products.find(product => product.id === item.productId)
  })).filter(item => item.product);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
  const hasUnpricedItem = cartItems.some(item => item.product.price == null);

  const addToCart = productId => {
    setStore(current => {
      const existing = current.cart.find(item => item.productId === productId);
      return {
        ...current,
        cart: existing
          ? current.cart.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)
          : [...current.cart, { productId, quantity: 1 }]
      };
    });
    showToast("Added to your bag.");
  };

  const submitOrder = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const items = cartItems.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    }));
    if (!items.length) return;
    const order = {
      id: `KK-${String(Date.now()).slice(-6)}`,
      name: String(data.get("name")).trim(),
      contact: String(data.get("contact")).trim(),
      notes: String(data.get("notes")).trim(),
      items,
      total: hasUnpricedItem ? null : cartTotal,
      status: "New",
      date: new Date().toISOString()
    };
    setStore(current => ({ ...current, orders: [order, ...current.orders], cart: [] }));
    setCheckoutOpen(false);
    event.currentTarget.reset();
    showToast(`Order request ${order.id} saved on this device.`);
  };

  const submitMeasurements = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const request = {
      id: `CUSTOM-${String(Date.now()).slice(-6)}`,
      name: String(data.get("name")).trim(),
      contact: String(data.get("contact")).trim(),
      design: String(data.get("design")).trim(),
      measurements: Object.fromEntries(["bust", "waist", "hips", "shoulder", "sleeve", "length"].map(key => [key, data.get(key)])),
      status: "New",
      date: new Date().toISOString()
    };
    setStore(current => ({ ...current, requests: [request, ...current.requests] }));
    setMeasurementOpen(false);
    event.currentTarget.reset();
    showToast(`Custom request ${request.id} saved on this device.`);
  };

  return (
    <>
      <Header isAdmin={isAdmin} cartCount={cartCount} onStudio={() => { setIsAdmin(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} onCart={() => setCartOpen(true)} />
      {isAdmin
        ? <Admin store={store} setStore={setStore} activeTab={activeTab} setActiveTab={setActiveTab} onBack={() => setIsAdmin(false)} onError={showToast} />
        : <Storefront products={store.products.filter(product => product.active)} onAdd={addToCart} onError={showToast} onMeasurement={() => setMeasurementOpen(true)} />}
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} store={store} setStore={setStore} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />
      <MeasurementModal open={measurementOpen} onClose={() => setMeasurementOpen(false)} onSubmit={submitMeasurements} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onSubmit={submitOrder} total={hasUnpricedItem ? "Price to be confirmed" : money(cartTotal)} />
      <Toast message={toast} />
    </>
  );
}
