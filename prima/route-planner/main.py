#!/usr/bin/env python3

import argparse
from route_planner.services.planner import RoutePlanner
from route_planner.services.fixed_planner import FixedRoutePlanner
from route_planner.services.variable_planner import VariableRoutePlanner
from route_planner.services.mid_mile_planner import MidMilePlanner

def main():
    parser = argparse.ArgumentParser(description='Route Planner CLI')
    parser.add_argument('--planner', type=str, choices=['fixed', 'variable', 'mid_mile'],
                      default='fixed', help='Type of planner to use')
    parser.add_argument('--input-file', type=str, help='Input data file path')
    parser.add_argument('--output-file', type=str, help='Output file path for results')
    
    args = parser.parse_args()
    
    # Initialize the appropriate planner
    if args.planner == 'fixed':
        planner = FixedRoutePlanner()
    elif args.planner == 'variable':
        planner = VariableRoutePlanner()
    else:
        planner = MidMilePlanner()
    
    try:
        # Plan routes
        routes = planner.plan(
            input_file=args.input_file,
            output_file=args.output_file
        )
        
        print(f"Successfully planned routes using {args.planner} planner")
        print(f"Results saved to: {args.output_file}")
        
    except Exception as e:
        print(f"Error during route planning: {str(e)}")
        return 1
    
    return 0

if __name__ == '__main__':
    exit(main()) 