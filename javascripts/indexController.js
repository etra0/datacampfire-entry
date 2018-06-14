var DMCViewer = angular.module('DMCViewer', []);

function mainController($scope, $http) {

    plots = ['gastoAnual', 'gastoMensual', 'gastoPromedioAnualPartida',
    'gastoAnualPorPartida', 'gastoAnualCapitulo',
    'gastoAnualSubtitulo', 'gastoMensualPred', 'gastoPromedioDec'];

    var handlers = {};

    plots.forEach((plot) => {

        console.log("loading", plot);

        $http.get(`data/${plot}.json`)
        .success(function(data) {
            $scope[plot + "Data"] = data

            console.log(plot, $scope[plot + "Data"]);
            if ("data" in $scope[plot + "Data"] &&
                "url" in $scope[plot + "Data"].data)
                $scope[plot + "Data"].data.url = "data/" + $scope[plot + "Data"].data.url;

            if ("layer" in $scope[plot + "Data"] &&
                    "data" in $scope[plot + "Data"].layer[0]) {
                $scope[plot + "Data"].layer
                .map(x => { x.data.url = "data/" + x.data.url })
            }

            if (plot === 'gastoPromedioDec') {
                console.log($scope[plot + 'Data'].config.view.width)
                $scope[plot + 'Data'].config.view.width = $(`#${plot}Container`).width()*0.9;
                $scope[plot + 'Data'].layer[0].width = $(`#${plot}Container`).width()*0.7;
            } else if (plot === 'gastoMensualPred') {
                $scope[plot + "Data"].width = $(`#${plot}Container`).width()*0.8;
            } else if (plot === 'gastoAnualSubtitulo') {
                $scope[plot + "Data"].width = $(`#${plot}Container`).width()*0.5;
            } else {
                $scope[plot + "Data"].width = $(`#${plot}Container`).width()*0.7;
            }



            handlers[plot] = new vegaTooltip.Handler();

            vegaEmbed(`#${plot}Chart`, $scope[plot + "Data"],
                {"mode": "vega-lite", tooltip: handlers[plot].call})
                .then(result => {
                    result.run();
                    })
                .catch(error => console.log(error));
        })
    });

}
