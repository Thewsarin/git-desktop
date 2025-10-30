// Authentication Module
// Handles user login, logout, and registration

let currentUser = null
const users = [] // Declare the users variable
const addUser = (user) => {
  users.push(user)
} // Declare the addUser variable
const showPage = (page) => {
  console.log(`Showing ${page}`)
} // Declare the showPage variable

// Login handler
function handleLogin(username, password) {
  const user = users.find((u) => u.username === username && u.password === password)

  if (user) {
    currentUser = user
    return { success: true, user }
  }

  return { success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }
}

// Register handler
function handleRegister(userData) {
  if (users.find((u) => u.username === userData.username)) {
    return { success: false, message: "ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว" }
  }

  const newUser = {
    username: userData.username,
    password: userData.password,
    name: userData.name,
    tel: userData.tel,
    email: userData.email,
    department: Number.parseInt(userData.department),
    role: "user",
  }

  addUser(newUser)
  return { success: true, message: "ลงทะเบียนสำเร็จ" }
}

// Logout handler
function logout() {
  if (confirm("ต้องการออกจากระบบหรือไม่?")) {
    currentUser = null
    document.getElementById("adminMenu").style.display = "none"
    showPage("loginPage")
  }
}

// Get current user
function getCurrentUser() {
  return currentUser
}

// Check if user has admin/IT role
function isAdminOrIT() {
  return currentUser && (currentUser.role === "admin" || currentUser.role === "it")
}

// Get role display text
function getRoleText(role) {
  if (role === "admin") return "ผู้ดูแลระบบ"
  if (role === "it") return "เจ้าหน้าที่ IT"
  return "บุคลากร"
}
