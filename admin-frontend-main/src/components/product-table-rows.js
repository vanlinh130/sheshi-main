import React, { useEffect, useState } from 'react'
import { Input, Space, Select, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import configDataApis from '@/apis/configDataApis';
import { MASTER_DATA_NAME } from '@/constants';
const { Option } = Select;

const ProductTableRows = ({ rowsData, deleteTableRows, handleChangeTableRows, handleChangeTableRowsCombobox }) => {

    const [masterUnit, setMasterUnit] = useState([])
    const [masterCapacity, setMasterCapacity] = useState([])

    const fetchMasterData = async () => {
        const fetchMasterCapacity = await configDataApis.getAllConfigData({
          idMaster: MASTER_DATA_NAME.CAPACITY_PRODUCT,
        });
        const fetchMasterUnit = await configDataApis.getAllConfigData({
          idMaster: MASTER_DATA_NAME.UNIT_PRODUCT,
        });
        setMasterCapacity(fetchMasterCapacity)
        setMasterUnit(fetchMasterUnit)
    };

    useEffect(() => {
      fetchMasterData();
    }, []);

    return (
        rowsData.map((data, index) => {
            const { price, quantity, unitId, capacityId } = data;
            return (
              <tr key={index}>
                <td>
                  <Input
                    value={price}
                    maxLength={10}
                    onChange={(evnt) => {
                      if (!+evnt.target.value) return;
                      return handleChangeTableRows(index, evnt);
                    }}
                    name="price"
                    placeholder="Giá bán"
                    suffix="đ"
                  />
                </td>
                <td>
                  <Input
                    value={quantity}
                    maxLength={5}
                    onChange={(evnt) => {
                      if (!+evnt.target.value) return;
                      return handleChangeTableRows(index, evnt);
                    }}
                    name="quantity"
                    placeholder="Số lượng"
                  />
                </td>
                <td>
                  <Space>
                    <Select
                      name="capacity"
                      showSearch
                      style={{
                        width: 200,
                      }}
                      placeholder="Dung tích/ Trọng lượng"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children - optionB.children
                      }
                      value={capacityId}
                      onChange={(val) =>
                        handleChangeTableRowsCombobox(index, "capacityId", val)
                      }
                    >
                      {masterCapacity.map((e) => {
                        return (
                          <Option value={e.id} key={e.id}>
                            {e.name}
                          </Option>
                        );
                      })}
                    </Select>

                    <Select
                      showSearch
                      name="unitId"
                      style={{
                        width: 100,
                      }}
                      value={unitId}
                      placeholder="Đơn vị"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children
                          .toLowerCase()
                          .localeCompare(optionB.children.toLowerCase())
                      }
                      onChange={(val) =>
                        handleChangeTableRowsCombobox(index, "unitId", val)
                      }
                    >
                      {masterUnit.map((e) => {
                        return (
                          <Option value={e.id} key={e.id}>
                            {e.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Space>
                </td>
                <td>
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => deleteTableRows(index)}
                  >
                    <Button icon={<DeleteOutlined />} />
                  </Popconfirm>
                </td>
              </tr>
            );
        })

    )
}

export default ProductTableRows
