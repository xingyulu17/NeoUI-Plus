import { test, expect, describe, vi, Mocked } from 'vitest'
import { testFn, request } from './utils'
import axios from 'axios'

// 测试的命令是 ：  npx vitest example             即：npx vitest + 文件名

// 监控第三方库 做的两行准备
vi.mock('axios')
const mockedAxios = axios as Mocked<typeof axios>

describe('functions', () => {
  // 监控函数有没有执行
  test('create a mock function', () => {
    const callback = vi.fn()
    testFn(12, callback)
    // expect 是断言
    expect(callback).toHaveBeenCalled() // toHaveBeenCalled  是callback被调用了
    expect(callback).toHaveBeenCalledWith(12)
  })
  // 监控对象上的一个方法
  test('spy on method', () => {
    const obj = {
      getName: () => 1,
    }
    const spy = vi.spyOn(obj, 'getName') // 监控 obj对象上的getName方法有没有正常调用
    obj.getName()
    expect(spy).toHaveBeenCalled() //看对象上的方法有没有被调用
    obj.getName()
    expect(spy).toHaveBeenCalledTimes(2) //看对象上的方法有没有被调用 2 次
  })

  // 监控第三方库
  test('mock third party module', async () => {
    mockedAxios.get.mockImplementation(() => Promise.resolve({ data: 123 })) //再发送请求的话  返回的值是这里提供的 123
    mockedAxios.get.mockResolvedValue({ data: 123 }) //对上面那行的简写
    const result = await request()
    expect(result).toBe(123)
  })
})

// 以下是跟本项目无关的测试
// vitest 完全适配 vite  不用做任何的配置
test('test common matcher', () => {
  const name = 'viking'
  expect(name).toBe('viking')
  expect(2 + 2).toBe(4)
  expect(2 + 2).not.toBe(5)
})

test('test to be  true or false', () => {
  expect(1).toBeTruthy()
  expect(0).toBeFalsy()
})

test('test number', () => {
  expect(4).toBeGreaterThan(3) // 4 比 3 大
  expect(2).toBeLessThan(3)
})

test('test object', () => {
  // toBe 是要完全相等  但这样写相当于是两个对象
  // expect({ name: 'viking' }).toBe({ name: 'viking' })
  expect({ name: 'viking' }).toEqual({ name: 'viking' })
})
