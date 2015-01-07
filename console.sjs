let console = macro {
    case {_.log( $x:expr (,) ... ) } => {
        function eStr(){ return ""; }
        function printStx(stx) {
            if(stx.token.type === parser.Token.Delimiter) {
                return (
                    stx.token.value[0] +
                    stx.token.inner.map(printStx).join("") +
                    stx.token.value[1]
                );
            } else if(stx.token.value === ",") {
                return ", ";
            }
            return prettyPrint([stx]).trim();
        }
        
        var here = #{ here };
        return #{ $x ... }.reduce(function(xs, stx, val) {
            letstx $stx = [stx];
            if(stx.token.inner.length !== 1) {
                val = stx.token.inner[0];
                if(val.token.type !== parser.Token.StringLiteral) {
                    var str = "    " + stx.token.inner.map(printStx).join("") + " =>";
                    return xs.concat(withSyntax($str = [makeValue(str, here)]) #{
                        console.log($str, JSON.stringify($stx));
                    });
                }
            }
            return xs.concat(#{ console.log($stx); });
        }, []);
    }
    rule { }
}

export console;