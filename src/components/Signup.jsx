import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  const [credentials, setCredentials] = useState({name:"", email: "", password: "", cpassword: "" })
  const navigate = useNavigate();

  // Canvas ref for animation start
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function noise(x, y) {
      const n = Math.sin(x * 0.01 + y * 0.01) * 43758.5453;
      return n - Math.floor(n);
    }

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 20 + 5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * -0.5 - 0.1;
        this.opacity = Math.random() * 0.08 + 0.03;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.01 - 0.005;
        this.lifespan = Math.random() * 80 + 50;
        this.age = 0;
      }
      update() {
        const turbulence = noise(this.x + this.age * 0.1, this.y + this.age * 0.1) * 0.15 - 0.075;
        this.speedX += turbulence;
        this.speedY += turbulence * 0.5;
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.96;
        this.speedY *= 0.96;
        this.size *= 0.985;
        this.age++;
        this.opacity = (Math.random() * 0.08 + 0.03) * (1 - Math.pow(this.age / this.lifespan, 1.5));
        this.rotation += this.rotationSpeed;
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalCompositeOperation = 'lighter';
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    let particles = [];

    function handleMouseMove(e) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      for (let i = 0; i < Math.random() * 2 + 2; i++) {
        particles.push(new Particle(mouseX, mouseY));
      }
    }

    window.addEventListener('mousemove', handleMouseMove);

    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.opacity > 0 && p.size > 0.5 && p.age < p.lifespan);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  //animation code ends here

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name, email, password}=credentials;
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name,email,password })
    });
    const json = await response.json()
    console.log(json);
    if(json.success){
      //save the auth token and redirect
      localStorage.setItem('token', json.authtoken);
      navigate("/");
      props.showAlert("Accounted Created, Successfully","success")
    }
    else{
      props.showAlert("Invalid Credentials","danger ")
    }
  }
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none"
        }}
      />
      <div className="container mt-3" style={{ position: "relative", zIndex: 1 }}>
        <h1>Create an account to use AuraNotes</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="text" className="form-label">Username</label>
            <input type="text" className="form-control" id="name" name="name" aria-describedby="emailHelp" onChange={onChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" onChange={onChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" name="password" onChange={onChange} minLength={5} required />
          </div>
          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} minLength={5} required />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default Signup