import React, { Component } from 'react'
import { Table, Tag, Layout, Typography } from 'antd'
import { contentStyle, tableStyle } from '../../styles'
import { connect } from 'react-redux'
import Highlighter from 'react-highlight-words'
import ReactSider from '../Navigation/ReactSider'
import { fetchExchanges, setSiderMenuItem } from '../../redux_actions'
import { Button, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
const { Content } = Layout
const { Title, Paragraph } = Typography

class ReactExchangesList extends Component {
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
          value={selectedKeys }
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
    this.props.fetchExchanges()
    this.props.setSiderMenuItem('exchanges-list')
  }

  render () {
    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        ...this.getColumnSearchProps('id')
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),
        render: country => (<Tag color="purple">{country}</Tag>)
      },
      {
        title: 'Year est.',
        dataIndex: 'year_established',
        key: 'year_established'
      },
      {
        title: 'Country',
        dataIndex: 'country',
        key: 'country',
        render: country => (<Tag color="blue">{country}</Tag>)
      },
      {
        title: 'Trade 24h BTC',
        dataIndex: 'trade_volume_24h_btc',
        key: 'trade_volume_24h_btc'
      }
    ]

    const loading = !(this.props.data.length > 0)

    return (
      <React.Fragment>
        <ReactSider/>
        <Layout style={{ padding: '1rem' }}>
          <Content style={contentStyle}>
            <Title level={2}>Exchanges List</Title>
            <Paragraph>This page lists available exchanges.</Paragraph>
            <Table
              style={tableStyle}
              bordered={true}
              loading={loading}
              dataSource={this.props.data}
              columns={columns} />
          </Content>
        </Layout>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.exchanges
  }
}

const mapActionsToProps = {
  fetchExchanges,
  setSiderMenuItem
}

export default connect(mapStateToProps, mapActionsToProps)(ReactExchangesList)
