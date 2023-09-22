/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./sinaNexTS/sina/DataSourceResultSet", "./sinaNexTS/sina/UserCategoryDataSource"], function (___sinaNexTS_sina_DataSourceResultSet, ___sinaNexTS_sina_UserCategoryDataSource) {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

  var DataSourceResultSet = ___sinaNexTS_sina_DataSourceResultSet["DataSourceResultSet"];
  var UserCategoryDataSource = ___sinaNexTS_sina_UserCategoryDataSource["UserCategoryDataSource"]; // =======================================================================
  // tree node
  // =======================================================================

  var Node = /*#__PURE__*/function () {
    function Node(dataSource, count) {
      _classCallCheck(this, Node);

      this.dataSource = dataSource;
      this.count = count;
      this.children = [];
      this.parent = null;
    }

    _createClass(Node, [{
      key: "equals",
      value: function equals(other) {
        return this === other;
      }
    }, {
      key: "setCount",
      value: function setCount(count) {
        this.count = count;
      }
    }, {
      key: "getAncestors",
      value: function getAncestors() {
        /* eslint consistent-this: 0 */
        var ancestors = []; // eslint-disable-next-line @typescript-eslint/no-this-alias

        var currentNode = this;

        while (currentNode.parent) {
          ancestors.push(currentNode.parent);
          currentNode = currentNode.parent;
        }

        return ancestors;
      }
    }, {
      key: "getChildren",
      value: function getChildren() {
        // collect children, ignore children with unsure path information
        var children = [];

        for (var i = 0; i < this.children.length; ++i) {
          var child = this.children[i];

          if (child.unsureWhetherNodeisBelowRoot) {
            continue;
          }

          children.push(child);
        }

        return children;
      }
    }, {
      key: "getChildrenSortedByCount",
      value: function getChildrenSortedByCount() {
        // collect children, ignore children with unsure path information
        var children = this.getChildren(); // sort by count

        children.sort(function (c1, c2) {
          return c2.count - c1.count;
        });
        return children;
      }
    }, {
      key: "clearChildren",
      value: function clearChildren() {
        for (var i = 0; i < this.children.length; ++i) {
          var child = this.children[i];
          child.parent = null;
        }

        this.children = [];
      }
    }, {
      key: "appendNode",
      value: function appendNode(node) {
        node.parent = this;
        this.children.push(node);
      }
    }, {
      key: "appendNodeAtIndex",
      value: function appendNodeAtIndex(node, index) {
        node.parent = this;
        this.children.splice(index, 0, node);
      }
    }, {
      key: "removeChildNode",
      value: function removeChildNode(node) {
        // remove from children
        var index = this.children.indexOf(node);

        if (index < 0) {
          return;
        }

        this.children.splice(index, 1); // node now has no parent

        node.parent = null;
      }
    }, {
      key: "hasChild",
      value: function hasChild(node) {
        return this.children.indexOf(node) > -1;
      }
    }, {
      key: "hasSibling",
      value: function hasSibling(node) {
        if (this.equals(node)) {
          return false;
        }

        var parent = this.parent;

        if (!parent) {
          return false;
        }

        if (parent.hasChild(node)) {
          return true;
        }

        return false;
      }
    }, {
      key: "_findNode",
      value: function _findNode(dataSource, result) {
        if (this.dataSource === dataSource) {
          result.push(this);
          return;
        }

        for (var i = 0; i < this.children.length; ++i) {
          var child = this.children[i];

          child._findNode(dataSource, result);

          if (result.length > 0) {
            return;
          }
        }
      }
    }]);

    return Node;
  }(); // =======================================================================
  // tree
  // =======================================================================


  var Tree = /*#__PURE__*/function () {
    function Tree(rootDataSource) {
      _classCallCheck(this, Tree);

      this.rootNode = new Node(rootDataSource, null);
    }

    _createClass(Tree, [{
      key: "reset",
      value: function reset() {
        this.rootNode = null;
      }
    }, {
      key: "invalidate",
      value: function invalidate(dataSource) {
        var node = this.findNode(dataSource);

        if (!node) {
          this.rootNode.children = [];
          this.rootNode.count = 0;
          return;
        }

        var childNode = null;

        while (node) {
          node.children = childNode ? [childNode] : [];
          node.count = null;

          if (childNode) {
            childNode.count = null;
          }

          childNode = node;
          node = node.parent;
        }
      }
    }, {
      key: "findNode",
      value: function findNode(dataSource) {
        if (!this.rootNode) {
          return null;
        }

        var result = [];

        this.rootNode._findNode(dataSource, result);

        return result.length > 0 ? result[0] : null;
      }
    }, {
      key: "hasChild",
      value: function hasChild(ds1, ds2) {
        if (ds2 === this.rootNode.dataSource) {
          return false;
        }

        var node1 = this.findNode(ds1);

        if (!node1) {
          //throw 'No node for datasource ' + ds1.toString();
          return false;
        }

        var node2 = this.findNode(ds2);

        if (!node2) {
          //throw 'No node for datasource ' + ds2.toString();
          return false;
        }

        return node1.hasChild(node2);
      }
    }, {
      key: "hasSibling",
      value: function hasSibling(ds1, ds2) {
        if (ds2 === this.rootNode.dataSource) {
          return false;
        }

        var node1 = this.findNode(ds1);

        if (!node1) {
          //throw 'No node for datasource ' + ds1.toString();
          return false;
        }

        var node2 = this.findNode(ds2);

        if (!node2) {
          //throw 'No node for datasource ' + ds2.toString();
          return false;
        }

        return node1.hasSibling(node2);
      }
    }, {
      key: "updateFromPerspective",
      value: function updateFromPerspective(dataSource, perspective, model) {
        // update current tree node
        var currentCount;

        if (perspective) {
          currentCount = perspective.totalCount;
        }

        var currentNode = this.findNode(dataSource);

        if (!currentNode) {
          // node not found -> create new node and append temporary below root node
          // we do not really now that this node is directly below root -> set flag unsureWhetherNodeisBelowRoot
          // flag is evaluated later in order to correct location of node
          currentNode = new Node(dataSource, currentCount);
          currentNode.unsureWhetherNodeisBelowRoot = true;
          this.rootNode.appendNode(currentNode);
        }

        currentNode.setCount(currentCount); // for root node: add apps to count

        if (dataSource === model.allDataSource || model.isUserCategory()) {
          currentNode.setCount(currentNode.count + model.getProperty("/appCount"));
        } // update child nodes


        this.updateFromPerspectiveChildDataSources(currentNode, perspective, model); // update app tree node

        this.updateAppTreeNode(dataSource, model);
      }
    }, {
      key: "updateAppTreeNode",
      value: function updateAppTreeNode(dataSource, model) {
        // update only if datasource is all, apps or My Favorites with includeApps flag = true
        if (model.isBusinessObject() || model.isOtherCategory() && !model.isAppCategory() && !model.isUserCategory() || model.isUserCategory() && !dataSource.isIncludeApps()) {
          return;
        } // remove old appNode


        var appNode = this.findNode(model.appDataSource);

        if (appNode) {
          this.rootNode.removeChildNode(appNode);
        } // no apps and datasource!=apps -> return


        var appCount = model.getProperty("/appCount");

        if (appCount === 0 && dataSource !== model.appDataSource) {
          return;
        } // insert new app node


        appNode = new Node(model.appDataSource, appCount);
        this.rootNode.appendNodeAtIndex(appNode, 0); //App node should always be right after All
      }
    }, {
      key: "updateFromPerspectiveChildDataSources",
      value: function updateFromPerspectiveChildDataSources(currentNode, perspective, model) {
        function isDataSourceResultSetItem(item) {
          return item instanceof DataSourceResultSet;
        } // extract child datasources from perspective


        if (!perspective || currentNode.dataSource === model.appDataSource) {
          // if ds==myfav && myfav has only apps -> add apps below myfav
          return;
        }

        var facets = perspective.facets;

        if (facets.length === 0) {
          // in case of My Favorites Category no facets exist, but children must be cleared (connectors do not have children)
          currentNode.clearChildren();
          return;
        }

        if (!isDataSourceResultSetItem(facets[0])) {
          return;
        }

        var dataSourceFacet = facets[0];

        if (dataSourceFacet.type !== model.sinaNext.FacetType.DataSource) {
          return;
        }

        var childDataSourceElements = dataSourceFacet.items; // append children to tree node

        currentNode.clearChildren(); // add My Favorites (UserCategory)

        if (model.favDataSource && currentNode.dataSource === model.allDataSource) {
          var favDataSourceElement = {
            dataSource: model.favDataSource,
            dimensionValueFormatted: model.favDataSource.labelPlural,
            measureValue: 0,
            measureValueFormatted: ""
          };
          childDataSourceElements.splice(0, 0, favDataSourceElement);
        } // add Apps in My Favorites tree if User Settings flag includeApps = true


        var appMeasureValue = model.getProperty("/appCount");

        if (model.isUserCategory() && currentNode.dataSource instanceof UserCategoryDataSource && currentNode.dataSource.isIncludeApps() && appMeasureValue > 0) {
          var appNode = this.findNode(model.appDataSource);

          if (!appNode) {
            appNode = new Node(model.appDataSource, appMeasureValue);
          }

          appNode.setCount(appMeasureValue);
          currentNode.appendNode(appNode);
        }

        for (var i = 0; i < childDataSourceElements.length; ++i) {
          var childDataSourceElement = childDataSourceElements[i];
          var childDataSource = childDataSourceElement.dataSource;
          var childNode = this.findNode(childDataSource);

          if (!childNode) {
            childNode = new Node(childDataSource, childDataSourceElement.measureValue);
          }

          if (childNode.unsureWhetherNodeisBelowRoot) {
            childNode.unsureWhetherNodeisBelowRoot = false;
            this.rootNode.removeChildNode(childNode);
          }

          if (childNode.parent) {
            childNode.parent.removeChildNode(childNode);
          }

          childNode.setCount(childDataSourceElement.measureValue);
          currentNode.appendNode(childNode);
        }
      }
    }]);

    return Tree;
  }(); // =======================================================================
  // formatter
  // =======================================================================


  var Formatter = /*#__PURE__*/function () {
    function Formatter(rootDataSource) {
      _classCallCheck(this, Formatter);

      this.tree = new Tree(rootDataSource);
    }

    _createClass(Formatter, [{
      key: "format",
      value: function format(dataSource, perspective, model) {
        this.tree.updateFromPerspective(dataSource, perspective, model);
        var tabStrips = this.generateTabStrips(dataSource, model);
        return tabStrips;
      }
    }, {
      key: "invalidate",
      value: function invalidate(dataSource) {
        if (this.tree) {
          this.tree.invalidate(dataSource);
        }
      }
    }, {
      key: "generateTabStrips",
      value: function generateTabStrips(dataSource, model) {
        // call default tab strip generation
        var tabStrips = this.doGenerateTabStrips(dataSource, model); // modify tabstips by exit but always ensure that selected datsasource is included in the tabstrips

        var formattedStrips = model.config.tabStripsFormatter(tabStrips.strips);

        if (formattedStrips.indexOf(tabStrips.selected) < 0) {
          formattedStrips.splice(0, 0, tabStrips.selected); // add selected datasource
        }

        tabStrips.strips = formattedStrips;
        return tabStrips;
      }
    }, {
      key: "doGenerateTabStrips",
      value: function doGenerateTabStrips(dataSource, model) {
        /* eslint no-lonely-if:0 */
        // init
        var tabStripLimit = 9999;
        var i, child, children;
        var tabStrips = {
          strips: [],
          selected: null
        };
        var node = this.tree.findNode(dataSource); // 1) no node in tree -> show ALL+ current datasource (should never happen)

        if (!node) {
          if (dataSource !== model.allDataSource) {
            tabStrips.strips.push(model.allDataSource);
          }

          tabStrips.strips.push(dataSource);
          tabStrips.selected = dataSource;
          return tabStrips;
        } // 2) node is $$ALL$$ -> show $$ALL$$ + children of $$ALL$$


        if (node.dataSource === model.allDataSource) {
          tabStrips.strips.push(model.allDataSource);
          children = node.getChildrenSortedByCount();

          for (i = 0; i < children.length && tabStrips.strips.length < tabStripLimit; ++i) {
            child = children[i];
            tabStrips.strips.push(child.dataSource);
          }

          tabStrips.selected = model.allDataSource;
          return tabStrips;
        } // 3) node is direct child of $$ALL$$ -> show $$ALL$$ + children of $$ALL$$


        if (node.parent === this.tree.rootNode && !node.unsureWhetherNodeisBelowRoot) {
          tabStrips.strips.push(model.allDataSource); // limit number of tabstrips but ensure that selected
          // node is included

          var includesNode = false;
          children = this.tree.rootNode.getChildrenSortedByCount();

          for (i = 0; i < children.length; ++i) {
            child = children[i];

            if (includesNode) {
              if (tabStrips.strips.length >= tabStripLimit) {
                break;
              }

              tabStrips.strips.push(child.dataSource);
            } else {
              if (tabStrips.strips.length < tabStripLimit - 1 || node === child) {
                tabStrips.strips.push(child.dataSource);

                if (node === child) {
                  includesNode = true;
                }
              }
            }
          }

          if (children.length === 0) {
            tabStrips.strips.push(node.dataSource);
          } // To be verified: move current datasource to second position
          //                var indexOfMyDatasource = tabStrips.strips.indexOf(node.dataSource);
          //                tabStrips.strips.splice(indexOfMyDatasource, 1);
          //                tabStrips.strips.splice(1, 0, node.dataSource);


          tabStrips.selected = node.dataSource;
          return tabStrips;
        } // 4) node not direct child of $$ALL$$ or unknown whether node is direct child of $$ALL$$
        // -> show $$ALL$$ + node


        tabStrips.strips.push(model.allDataSource);
        tabStrips.strips.push(node.dataSource);
        tabStrips.selected = node.dataSource;
        return tabStrips;
      }
    }]);

    return Formatter;
  }();

  var __exports = {
    __esModule: true
  };
  __exports.Tree = Tree;
  __exports.Formatter = Formatter;
  return __exports;
});
})();