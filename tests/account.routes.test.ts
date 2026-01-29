import request from 'supertest'
import { createApp } from 'src/app'
import { closeDB, connectToDatabase, getDB } from 'src/db/connection'

let app: ReturnType<typeof createApp>
let createdId: string

describe('account routes (integration)', () => {
  beforeAll(async () => {
    await connectToDatabase()
    app = createApp()
  })

  afterAll(async () => {
    await closeDB()
  })

  it('creates account', async () => {
    const res = await request(app)
      .post('/accounts')
      .send({ name: 'Test account', scope: 'account' })

    console.log('create result:', res.body)

    expect(res.status).toBe(201)
    expect(res.body.name).toBe('Test account')
    expect(res.body.scope).toBe('account')
    expect(res.body._id).toBeTruthy()

    createdId = res.body._id
  })

  it('updates account created earlier', async () => {
    const res = await request(app)
      .put(`/accounts/${createdId}`)
      .send({ name: 'Updated - Test account', scope: 'prospect' })

    console.log('update result:', res.body)

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Updated - Test account')
    expect(res.body.scope).toBe('prospect')
  })

  it('returns validation errors', async () => {
    const res = await request(app)
      .post('/accounts')
      .send({ name: 'Bad', scope: 'sample', updatedAt: new Date() })

    console.log('validation errors:', res.body)

    expect(res.status).toBe(400)
    expect(Array.isArray(res.body.errors)).toBe(true)
  })

  it('returns stats', async () => {
    await getDB().collection('Accounts').deleteMany({})

    await request(app).post('/accounts').send({ name: 'Test - A1', scope: 'account' })
    await request(app).post('/accounts').send({ name: 'Test - P1', scope: 'prospect' })
    await request(app).post('/accounts').send({ name: 'Test - C1', scope: 'child' })
    await request(app).post('/accounts').send({ name: 'Test - A2', scope: 'account' })

    const res = await request(app).get('/accounts/stats')

    console.log('stats result:', res.body)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ accounts: 2, prospects: 1, children: 1 })
  })
})
