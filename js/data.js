// Data Management Module
// Handles all data storage and retrieval using localStorage

let users = []
let requests = []
let equipment = []
const departments = [
  { id: 1, name: "แผนกผู้ป่วยนอก" },
  { id: 2, name: "แผนกผู้ป่วยใน" },
  { id: 3, name: "แผนกฉุกเฉิน" },
  { id: 4, name: "แผนกเภสัชกรรม" },
  { id: 5, name: "แผนกเทคโนโลยีสารสนเทศ" },
  { id: 6, name: "แผนกบริหาร" },
]

// Initialize demo data
function initializeDemoData() {
  users = [
    {
      id: 1,
      username: "admin",
      password: "admin123",
      name: "ผู้ดูแลระบบ",
      role: "admin",
      department: 5,
      tel: "081-234-5678",
      email: "admin@hospital.com",
    },
    {
      id: 2,
      username: "it_staff",
      password: "it123",
      name: "สมชาย ใจดี",
      role: "it",
      department: 5,
      tel: "081-234-5679",
      email: "it@hospital.com",
    },
    {
      id: 3,
      username: "user",
      password: "user123",
      name: "สมหญิง รักงาน",
      role: "user",
      department: 1,
      tel: "081-234-5680",
      email: "user@hospital.com",
    },
  ]

  equipment = [
    { id: 1, assetNo: "PC-001", name: "คอมพิวเตอร์ตั้งโต๊ะ Dell", type: "คอมพิวเตอร์", department: 1 },
    { id: 2, assetNo: "PR-001", name: "เครื่องพิมพ์ HP LaserJet", type: "เครื่องพิมพ์", department: 1 },
    { id: 3, assetNo: "PC-002", name: "คอมพิวเตอร์ตั้งโต๊ะ Lenovo", type: "คอมพิวเตอร์", department: 2 },
  ]

  requests = [
    {
      id: 1,
      userId: 3,
      equipmentType: "คอมพิวเตอร์",
      assetNo: "PC-001",
      subject: "คอมพิวเตอร์เปิดไม่ติด",
      detail: "กดปุ่มเปิดแล้วไม่มีอะไรเกิดขึ้น ไฟไม่ติด",
      priority: "ด่วน",
      location: "ห้องตรวจ 1",
      status: "รอรับงาน",
      date: new Date().toISOString(),
      assignedTo: null,
    },
    {
      id: 2,
      userId: 3,
      equipmentType: "เครื่องพิมพ์",
      assetNo: "PR-001",
      subject: "เครื่องพิมพ์ติดกระดาษ",
      detail: "กระดาษติดข้างในเครื่อง ดึงออกไม่ได้",
      priority: "ปกติ",
      location: "ห้องพยาบาล",
      status: "กำลังดำเนินการ",
      date: new Date(Date.now() - 86400000).toISOString(),
      assignedTo: 2,
    },
  ]

  saveToLocalStorage()
}

// Local storage functions
function saveToLocalStorage() {
  localStorage.setItem("users", JSON.stringify(users))
  localStorage.setItem("requests", JSON.stringify(requests))
  localStorage.setItem("equipment", JSON.stringify(equipment))
}

function loadFromLocalStorage() {
  const savedUsers = localStorage.getItem("users")
  const savedRequests = localStorage.getItem("requests")
  const savedEquipment = localStorage.getItem("equipment")

  if (savedUsers) users = JSON.parse(savedUsers)
  if (savedRequests) requests = JSON.parse(savedRequests)
  if (savedEquipment) equipment = JSON.parse(savedEquipment)

  if (users.length === 0) {
    initializeDemoData()
  }
}

// Data access functions
function getUsers() {
  return users
}

function getRequests() {
  return requests
}

function getEquipment() {
  return equipment
}

function getDepartments() {
  return departments
}

function addUser(user) {
  user.id = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1
  users.push(user)
  saveToLocalStorage()
  return user
}

function addRequest(request) {
  request.id = requests.length > 0 ? Math.max(...requests.map((r) => r.id)) + 1 : 1
  requests.push(request)
  saveToLocalStorage()
  return request
}

function addEquipment(eq) {
  eq.id = equipment.length > 0 ? Math.max(...equipment.map((e) => e.id)) + 1 : 1
  equipment.push(eq)
  saveToLocalStorage()
  return eq
}

function updateRequest(requestId, updates) {
  const request = requests.find((r) => r.id === requestId)
  if (request) {
    Object.assign(request, updates)
    saveToLocalStorage()
    return request
  }
  return null
}

function deleteUser(userId) {
  users = users.filter((u) => u.id !== userId)
  saveToLocalStorage()
}

function deleteEquipment(equipmentId) {
  equipment = equipment.filter((e) => e.id !== equipmentId)
  saveToLocalStorage()
}

// Initialize data on load
window.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage()
})
