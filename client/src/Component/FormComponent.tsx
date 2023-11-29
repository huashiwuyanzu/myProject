import { Button, Form, Input, Radio, DatePicker } from "antd";
import { verificateStr } from "@/utils/util.ts";
import { $message } from "@/utils/render.tsx";
import { useEffect } from "react";

const { TextArea } = Input
const { RangePicker } = DatePicker

// 表单布局
const tailLayout = {
  wrapperCol: { offset: 4, span: 18 },
};

type handleFunction = (params?: any) => void

interface InputItem {
  name: string,
  type?: string
  label?: string,
  placeholder?: string,
  allowClear?: boolean,
  initialValue?: string,
  isRequire?: boolean,
  regularArr?: Array<RegExp>,
  message?: string,
  maxLength?: number,
  showCount?: boolean,
  disabled?: boolean,
}

interface RadioItem {
  name: string,
  options: Array<{ label: string, value: string | number }>
  label?: string,
  initialValue?: string | number,
  isRequire?: boolean
}

interface TextAreaItem {
  name: string,
  label?: string,
  placeholder?: string,
  allowClear?: boolean,
  initialValue?: string,
  isRequire?: boolean,
  regularArr?: Array<RegExp>,
  message?: string,
  maxLength?: number,
  rows?: number,
  showCount?: boolean,
  disabled?: boolean,
  autoSize?: {
    minRows: number,
    maxRows: number
  }
}

interface RangeDateItem {
  name: string,
  label?: string,
  initialValue?: string,
  isRequire?: boolean,
  disabled?: boolean,
  picker?: string,
  format?: string
}


interface FormOptions {
  width?: number,
  Inputs?: Array<InputItem>,
  Radios?: Array<RadioItem>,
  TextAreas?: Array<TextAreaItem>,
  RangeDates?: Array<RangeDateItem>,
  submitButton: {
    text?: string,
    clickHandler: handleFunction,
  },
  cancleButton?: {
    text: string,
    clickHandler: handleFunction,
  },
  resetButton?: {
    text: string,
  },
  resetWhenUnmounted?: boolean
}

function FormComponent(props: { formOptions: FormOptions | undefined }) {
  const [form] = Form.useForm()
  const { formOptions } = props
  const width = formOptions === undefined ? 0 : formOptions.width
  const submitButton: { text: string, clickHandler: handleFunction } = {
    text: '确定',
    clickHandler: () => {

    }
  }
  let cancleButton: undefined | Record<string, any> = undefined
  let resetButton: undefined | Record<string, any> = undefined
  let Inputs: Array<any> = []
  let Radios: Array<any> = []
  let TextAreas: Array<any> = []
  let RangeDates: Array<any> = []
  if (formOptions !== undefined) {
    submitButton.clickHandler = formOptions.submitButton.clickHandler
    submitButton.text = formOptions.submitButton.text === undefined ? '确定' : formOptions.submitButton.text
    if (formOptions.Inputs !== undefined) {
      Inputs = formOptions.Inputs
    }
    if (formOptions.Radios !== undefined) {
      Radios = formOptions.Radios
    }
    if (formOptions.TextAreas !== undefined) {
      TextAreas = formOptions.TextAreas
    }
    if (formOptions.RangeDates !== undefined) {
      RangeDates = formOptions.RangeDates
    }
    if (formOptions.cancleButton !== undefined) {
      cancleButton = {}
      cancleButton.clickHandler = formOptions.cancleButton.clickHandler
      cancleButton.text = formOptions.cancleButton.text === undefined ? '取消' : formOptions.cancleButton.text
    }
    if (formOptions.resetButton !== undefined) {
      resetButton = {}
      resetButton.text = formOptions.resetButton.text
    }
  }
  const InputList = Inputs.map(item => {
    return (
      <Form.Item
        key={item.name}
        name={item.name}
        initialValue={item.initialValue}
        label={item.label}
        rules={[{ required: item.isRequire, message: item.label + '必填' }]}
        style={{ width: '100%' }}
      >
        <Input
          maxLength={item.maxLength}
          type={item.type}
          placeholder={item.placeholder}
          allowClear={item.allowClear === true}
          showCount={item.showCount === true}
          disabled={item.disabled === true}
        ></Input>
      </Form.Item>
    )
  })
  const RadioList = Radios.map(item => {
    const { options } = item
    const radioItem = options.map((i: { value: string | number, label: string }) => {
      return (
        <Radio value={i.value} key={i.value}>{i.label}</Radio>
      )
    })
    return (
      <Form.Item
        key={item.name}
        name={item.name}
        initialValue={item.initialValue}
        label={item.label}
        rules={[{ required: item.isRequire, message: item.label + '必填' }]}
        style={{ width: '100%' }}
      >
        <Radio.Group>
          {radioItem}
        </Radio.Group>
      </Form.Item>
    )
  })
  const TextAreaList = TextAreas.map(item => {
    return (
      <Form.Item
        key={item.name}
        name={item.name}
        initialValue={item.initialValue}
        label={item.label}
        rules={[{ required: item.isRequire, message: item.label + '必填' }]}
        style={{ width: '100%' }}
      >
        <TextArea
          showCount={item.showCount === true}
          maxLength={item.maxLength}
          placeholder={item.placeholder}
          rows={item.rows === undefined ? 10 : item.rows}
          allowClear={item.allowClear === true}
          disabled={item.disabled === true}
          autoSize={item.autoSize}
        ></TextArea>
      </Form.Item>
    )
  })
  const RangeDateList = RangeDates.map(item => {
    return (
      <Form.Item
        key={item.name}
        name={item.name}
        label={item.label}
        initialValue={item.initialValue}
        rules={[{ required: item.isRequire, message: item.label + '必填' }]}
        style={{ width: '100%' }}
      ><RangePicker
          showTime={{ format: 'HH:mm' }}
          format={item.format}
          style={{ width: '100%' }}
          picker={item.picker}
        />
      </Form.Item>
    )
  })
  // 表单提交
  const submitHandler = function (value: Record<string, number | string>) {
    // InputList的正则校验
    for (let i = 0; i < Inputs.length; ++i) {
      const item: InputItem = Inputs[i]
      if (item.regularArr !== undefined) {
        const flag = verificateStr(value[item.name] as string, item.regularArr)
        if (!flag) {
          $message('error', item.message as string)
          return
        }
      }
    }
    submitButton.clickHandler(value)
  }
  useEffect(() => {
    return () => {
      form.resetFields()
    }
  })

  return (
    <Form
      form={form}
      className='antd--form'
      name="control-hooks"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ width: width === undefined ? '80%' : width }}
      onFinish={submitHandler}
    >
      {InputList}
      {RadioList}
      {TextAreaList}
      {RangeDateList}
      <Form.Item
        {...tailLayout}
        className='antd--form__item'
        style={{ marginTop: '30px' }}
      >
        <Button
          htmlType="submit"
          type='primary'
          style={{ marginLeft: "10px" }}
        >{submitButton.text === undefined ? '确定' : submitButton.text}</Button>
        {cancleButton === undefined ? null : (
          <Button
            htmlType="button"
            onClick={() => {
              (cancleButton as Record<string, any>).clickHandler()
            }}
            style={{ marginLeft: "10px" }}
          >{cancleButton.text === undefined ? '取消' : cancleButton.text}</Button>
        )}
        {resetButton === undefined ? null : (
          <Button
            htmlType="button"
            onClick={() => {
              form.resetFields()
            }}
            style={{ marginLeft: "10px" }}
          >{resetButton.text}</Button>
        )}
      </Form.Item>
    </Form>
  )

}

export default FormComponent
