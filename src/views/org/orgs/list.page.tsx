import { Button, Card, Col, Form, Input, Row, Tree } from 'antd';
import { useState } from 'react';

import { useDeleteOrg, useListOrgTree } from '@/services/org';

import { OrgEditForm } from './edit.page';

export interface InputType {
    id?: number;
    // 生成树用
    parent?: number;
    // 展示用
    parentId?: number;
    label?: string;
    abbreviation?: string;
    type?: string;
    describe?: string;
    state?: boolean;
    sortValue?: number;
}

export interface OutputType {
    id?: number;
    parent?: OutputType;
    children?: OutputType[];
    depth?: number;
    label?: string;
    type?: string;
    abbreviation?: string;
    parentId?: number;
    sortValue?: number;
    state?: boolean;
    describe?: string;
    deletedAt?: Date;
    createdAt?: Date;
    createdBy?: number;
    updatedAt?: Date;
    updatedBy?: number;
}

export default () => {
    const [form] = Form.useForm();
    const defaultClickOne: InputType = { type: '01', state: true };
    // 状态定义
    const [checkedKeys, setCheckedKeys] = useState<number[]>();
    const [clickOne, setClickOne] = useState<InputType>(defaultClickOne);
    // API-hook
    const { data: listOrgTree } = useListOrgTree();
    const { mutateAsync } = useDeleteOrg();
    // ==========逻辑处理==========
    // 复选框点击时处理
    const onCheck = (checked: React.Key[] | { checked: React.Key[] }) => {
        if (!Array.isArray(checked)) {
            const { checked: checkedValues } = checked;
            setCheckedKeys(checkedValues.map((key) => Number(key)));
        }
    };
    // 树节点点击时处理
    const onSelect = async (selectedKeysValue: React.Key[], info: any) => {
        if (selectedKeysValue && selectedKeysValue.length > 0) {
            setClickOne(info.selectedNodes[0]);
        }
    };
    // 点击新增时的处理
    const addHandler = () => {
        defaultClickOne.parent = clickOne.id;
        defaultClickOne.parentId = clickOne.id;
        setClickOne(defaultClickOne);
    };
    // 点击删除时的处理
    const delHandler = async () => {
        if (checkedKeys) {
            mutateAsync(checkedKeys);
        }
    };
    return (
        <div>
            <Row>
                <Col>
                    <Form form={form}>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item name="name">
                                    <Input placeholder="机构名称" allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="search">
                                    <Button type="primary" htmlType="submit">
                                        搜索
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Button type="primary">重置</Button>
                            </Col>
                            <Col span={4}>
                                <Button type="primary" onClick={addHandler}>
                                    添加
                                </Button>
                            </Col>
                            <Col span={4}>
                                <Button type="primary" onClick={delHandler}>
                                    删除
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card style={{ width: 650 }}>
                        <Tree
                            checkable
                            checkStrictly
                            // 默认展开所有树节点
                            defaultExpandAll
                            // 点击复选框触发
                            onCheck={onCheck}
                            // 点击树节点触发
                            onSelect={onSelect}
                            treeData={listOrgTree}
                            fieldNames={{ title: 'label', key: 'id' }}
                        />
                    </Card>
                </Col>
                <Col>
                    <Card title={clickOne.id ? '修改' : '新增'} style={{ width: 600 }}>
                        <OrgEditForm clickOne={clickOne} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
