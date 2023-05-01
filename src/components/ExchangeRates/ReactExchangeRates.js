import React, { Component } from 'react'
import ReactSider from '../Navigation/ReactSider'
import { Layout, Typography, Table, Tag, Button, Input } from 'antd'
import { contentStyle, tableStyle } from '../../styles'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { connect } from 'react-redux'
import { fetchExchangeRates, setSiderMenuItem } from '../../redux_actions'
const { Content } = Layout
const { Title, Paragraph } = Typography

class ReactExchangeRates extends Component {
  state = {
    searchText: ''
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon={<SearchOutlined/>}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
                Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    )
  })

  handleSearch = (selectedKeys, confirm) => {
    confirm()
    this.setState({ searchText: selectedKeys[0] })
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState({ searchText: '' })
  }

  componentDidMount () {
    this.props.fetchExchangeRates()
    this.props.setSiderMenuItem('exchange-rates-list')
  };

  render () {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),
        render: item => <Tag color="purple">{ item }</Tag>
      },
      {
        title: 'Unit',
        dataIndex: 'unit',
        key: 'unit',
        ...this.getColumnSearchProps('unit')
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value'
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type'
      }
    ]

    const loading = !(this.props.data.length > 0)
    return (
      <React.Fragment>
        <ReactSider/>
        <Layout style={{ padding: '1rem' }}>
          <Content className="text-focus-in" style={{ ...contentStyle }}>
            <Title level={2}>Exchange Rates</Title>
            <Paragraph>View BTC-to-Currency exchange rates.</Paragraph>
            <Table
              style={tableStyle}
              dataSource={this.props.data}
              loading={loading}
              columns={columns}
            >
            </Table>
          </Content>
        </Layout>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.exchange_rates
  }
}

const mapActionsToProps = {
  fetchExchangeRates,
  setSiderMenuItem
}

export default connect(mapStateToProps, mapActionsToProps)(ReactExchangeRates)
