import React, { useState, useRef, useEffect } from "react";
import "./CertificateGenerator.css";

const CertificateGenerator = () => {
  const [name, setName] = useState("Your Name");
  const [category, setCategory] = useState("2KM RUNNING");
  const canvasRef = useRef(null);

  const categoryOptions = [
    "2km Running",
    "5km Running",
    "10km Running",
    "2km Walking",
    "5km Walking",
    "10km Walking",
    "2km Cycling",
    "5km Cycling",
    "10km Cycling",
    "GYM",
    "YOGA",
  ];

  const [images, setImages] = useState({
    template: null,
    user: null,
    overlay: null,
  });

  const [textStyle, setTextStyle] = useState({
    x: 482,
    y: 648,
    size: 58,
    color: "#164061ff",
    weight: "bold",
  });

  const [catStyle, setCatStyle] = useState({
    x: 608,
    y: 686.6,
    size: 21,
    color: "#164061",
  });

  // Photo Container Position (3:5 Ratio)
  // width: 300, height: 500 (3:5 ratio)
  const [imgPos, setImgPos] = useState({ x: 68, y: 364, w: 376, h: 475 });

  useEffect(() => {
    const imgT = new Image();
    imgT.src = "/template.jpg";
    imgT.onload = () => setImages((prev) => ({ ...prev, template: imgT }));

    const imgO = new Image();
    imgO.src = "/PARTICIPANT-LABEL-SVG.svg";
    imgO.onload = () => setImages((prev) => ({ ...prev, overlay: imgO }));
  }, []);

  const handleUserPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => setImages((prev) => ({ ...prev, user: img }));
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (images.template) renderCanvas();
  }, [name, category, images, textStyle, imgPos]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // 1. Background Template
    ctx.drawImage(images.template, 0, 0, 1080, 1350);

    // 2. User Photo Parent Container (3:5 Ratio)
    const { x, y, w, h } = imgPos; // w: 300, h: 500 (3:5)
    const borderRadius = 22;

    // --- A. Parent Container & Masking Logic ---
    ctx.save();
    ctx.beginPath();
      ctx.moveTo(x + borderRadius, y);
      ctx.lineTo(x + w - borderRadius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + borderRadius);
      ctx.lineTo(x + w, y + h - borderRadius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - borderRadius, y + h);
      ctx.lineTo(x + borderRadius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - borderRadius);
      ctx.lineTo(x, y + borderRadius);
      ctx.quadraticCurveTo(x, y, x + borderRadius, y);
      ctx.closePath();

    // Border for Parent
    ctx.strokeStyle = "transparent";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Masking (Clip): Ab iske bahar kuch nahi dikhega
    ctx.clip();

    if (images.user) {
      // Image Aspect Ratio Maintain karne ka logic (Object-fit: Cover)
      const imgWidth = images.user.width;
      const imgHeight = images.user.height;
      const imgRatio = imgWidth / imgHeight;
      const containerRatio = w / h;

      let drawW, drawH, drawX, drawY;

      if (imgRatio > containerRatio) {
        // Image zyada wide hai
        drawH = h;
        drawW = h * imgRatio;
        drawX = x + (w - drawW) / 2;
        drawY = y;
      } else {
        // Image zyada lambi hai
        drawW = w;
        drawH = w / imgRatio;
        drawX = x;
        drawY = y + (h - drawH) / 2;
      }

      ctx.drawImage(images.user, drawX, drawY, drawW, drawH);
    } else {
      // Placeholder if no image
      ctx.fillStyle = "transparent";
      ctx.fill();
    }
    ctx.restore(); // Clipping khatam

    // 3. Name Text
    if (name) {
      ctx.font = `${textStyle.weight} ${textStyle.size}px Arial`;
      ctx.fillStyle = textStyle.color;

      // Alignment center rakhein taki dono side faile

      // Yahan 540 ka matlab hai Canvas ka bilkul center (1080/2)
      // Isse text hamesha poster ke bich mein hi rahega aur dono side badhega
      ctx.fillText(name.toUpperCase(), textStyle.x, textStyle.y);
    }

    // 4. Category Text
    if (category) {
      ctx.font = `900 ${catStyle.size}px Arial`;
      ctx.fillStyle = catStyle.color;
      ctx.fillText(category.toUpperCase(), catStyle.x, catStyle.y);
    }

    // 5. Overlay Image
    if (images.overlay) {
      ctx.drawImage(images.overlay, 100, 793, 314, 73);
    }
  };

  return (
    <>
      <div className="top-logo1">
        <img src="/SFOC-logo-stripe.png" alt="Logo" />
        <h2 className="title title-top" style={{ fontWeight: 800 }}>
          SFOC 4 STUDIO{" "}
        </h2>
        {/* <img src="/logo-left.png" alt="Logo" /> */}
      </div>
      <div className="app-container">
        <aside className="editor-card">
          <div className="top-logo">
            <img src="/SFOC-logo-stripe.png" alt="Logo" />
            {/* <img src="/logo-left.png" alt="Logo" /> */}
          </div>
          <h2 className="title" style={{ fontWeight: 800 }}>
            SFOC 4 STUDIO{" "}
          </h2>

          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Category / Role</label>
            <select
              className="name-selector"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoryOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="control-section">
            <h4>Font Size</h4>
            <input
              type="range"
              min="20"
              max="150"
              value={textStyle.size}
              onChange={(e) =>
                setTextStyle({ ...textStyle, size: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="input-group">
            <label>User Photo</label>
            <div className="upload-zone">
              <div className="upload-icon"></div>
              <span className="upload-text">
                <b>Click to upload</b> or drag and drop
              </span>
              <input
                type="file"
                onChange={handleUserPhoto}
                accept="image/*"
                style={{
                  position: "absolute",
                  opacity: 0,
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>

          <button
            className="btn-generate"
            onClick={() => {
              const link = document.createElement("a");
              link.download = `${name}_SFOC.png`;
              link.href = canvasRef.current.toDataURL();
              link.click();
            }}
          >
            DOWNLOAD FINAL POSTER
          </button>
        </aside>

        <main className="preview-section">
          <canvas ref={canvasRef} width="1080" height="1350"></canvas>
        </main>
      </div>
    </>
  );
};

export default CertificateGenerator;
