const path = require('path');
const {
      override,
      fixBabelImports,
      addLessLoader,
      addWebpackAlias,
      useBabelRc,
      addDecoratorsLegacy,
      addWebpackPlugin 
    } = require("customize-cra");
    const ProgressBarPlugin = require('progress-bar-webpack-plugin');
    const chalk = require('chalk');
    
    module.exports = override(
      addDecoratorsLegacy(),
      useBabelRc(),
      fixBabelImports("import", {
        libraryName: "antd", libraryDirectory: "es", style: 'css' // change importing css to less
      }),
      addLessLoader({
        javascriptEnabled: true,
        modifyVars: { "@primary-color": "#1DA57A" }
      }),
      addWebpackAlias({        
            ["@"]: path.resolve(__dirname, "src/")
      }),
      addWebpackPlugin(new ProgressBarPlugin({
            complete: "█",
            format: `${chalk.green('Building')} [ ${chalk.green(':bar')} ] ':msg:' ${chalk.bold('(:percent)')}`,
            clear: true
          })
        )
      
    );

  