// @flow

import ReactReconciler from 'react-reconciler'

export type RootMemoryNode = {
  type: 'root',
  textContent: string,
  children: Array<MemoryNode>,
  _rootContainer?: $Call<
    $PropertyType<ReactReconcilerInst, 'createContainer'>,
    any,
    false
  >,
}

type ElementMemoryNode = {
  type: 'element',
  reactType: React$ComponentType<any>,
  attrs: { [key: string]: mixed },
  textContent: string,
  children: Array<MemoryNode>,
}

type TextMemoryNode = { type: 'text', text: string }

type MemoryNode = RootMemoryNode | ElementMemoryNode | TextMemoryNode

export type ReactFiberLane = number

const rootHostContext = {}
const childHostContext = {}

const hostConfig = {
  now: Date.now,

  getRootHostContext: () => {
    return rootHostContext
  },
  getChildHostContext: () => {
    return childHostContext
  },

  prepareForCommit: () => {},
  resetAfterCommit: () => {},

  shouldSetTextContent: <Props: { [key: string]: mixed }>(
    type: React$ComponentType<Props>,
    props: Props
  ): boolean => {
    return (
      typeof props.children === 'string' || typeof props.children === 'number'
    )
  },

  createInstance: (
    reactType: React$ComponentType<any>,
    newProps: { [key: string]: mixed },
    rootContainerInstance: mixed,
    _currentHostContext: mixed,
    workInProgress: mixed
  ): ElementMemoryNode => {
    const elementNode = {
      type: 'element',
      reactType,
      attrs: {},
      textContent: '',
      children: [],
    }
    Object.keys(newProps).forEach((propName) => {
      const propValue = newProps[propName]
      if (propName === 'children') {
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          elementNode.textContent = String(propValue)
        }
      } else {
        elementNode.attrs[propName] = propValue
      }
    })
    return elementNode
  },
  createTextInstance: (text: string): TextMemoryNode => {
    return { type: 'text', text }
  },

  appendInitialChild: (
    parent: RootMemoryNode | ElementMemoryNode,
    child: ElementMemoryNode | TextMemoryNode
  ): void => {
    parent.children.push(child)
  },
  appendChild: (
    parent: RootMemoryNode | ElementMemoryNode,
    child: ElementMemoryNode | TextMemoryNode
  ): void => {
    parent.children.push(child)
  },
  finalizeInitialChildren: (
    elementNode: RootMemoryNode | ElementMemoryNode,
    type: React$ComponentType<any>,
    props: { [key: string]: mixed }
  ) => {},
  supportsMutation: true,
  appendChildToContainer: (
    parent: RootMemoryNode | ElementMemoryNode,
    child: ElementMemoryNode | TextMemoryNode
  ): void => {
    parent.children.push(child)
  },
  removeChild(
    parent: RootMemoryNode | ElementMemoryNode,
    child: ElementMemoryNode | TextMemoryNode
  ): void {
    parent.children.filter((candidate) => {
      return candidate !== child
    })
  },
  removeChildFromContainer(
    parent: RootMemoryNode | ElementMemoryNode,
    child: ElementMemoryNode | TextMemoryNode
  ): void {
    parent.children.filter((candidate) => {
      return candidate !== child
    })
  },

  getPublicInstance() {
    return null
  },
  hideInstance() {},
  unhideInstance() {},

  prepareUpdate(
    elementNode: ElementMemoryNode | TextMemoryNode,
    oldProps: { [key: string]: mixed },
    newProps: { [key: string]: mixed }
  ): boolean {
    return true
  },
  commitUpdate(
    elementNode: ElementMemoryNode,
    updatePayload: mixed,
    type: React$ComponentType<any>,
    oldProps: { [key: string]: mixed },
    newProps: { [key: string]: mixed }
  ): void {
    Object.keys(newProps).forEach((propName) => {
      const propValue = newProps[propName]
      if (propName === 'children') {
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          elementNode.textContent = String(propValue)
        }
      } else {
        elementNode.attrs[propName] = propValue
      }
    })
  },
  commitTextUpdate(
    textNode: TextMemoryNode,
    oldText: string,
    newText: string
  ): void {
    textNode.text = newText
  },
}

const ReactReconcilerInst = ReactReconciler(hostConfig)

export default {
  render: (
    reactElement: React$Element<any>,
    elementNode: RootMemoryNode,
    callback?: () => void
  ): ReactFiberLane => {
    // Create a root Container if it doesnt exist
    if (!elementNode._rootContainer) {
      elementNode._rootContainer = ReactReconcilerInst.createContainer(
        elementNode,
        false
      )
    }

    // update the root Container
    return ReactReconcilerInst.updateContainer(
      reactElement,
      elementNode._rootContainer,
      null,
      callback
    )
  },

  createRoot: (): RootMemoryNode => {
    return { type: 'root', textContent: '', children: [] }
  },
}
